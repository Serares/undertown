import Vue from 'vue';
import { getTokenPayload } from './utils/methods';
import { tokenHeaderRequest } from '../../../services/clientRequests';
import { URLS } from './utils/urls';


export const addPropertyController = () => {
    // in mb
    const maxFileSize = 5;
    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ];

    function validFileType(file: File) {
        return fileTypes.includes(file.type);
    }

    function returnFileSize(number: number) {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        }
    }

    function validFileSize(file: File): boolean {
        return (file.size / 1024 / 1024) < maxFileSize;
    }

    enum uploadStatus {
        INITIAL = 0,
        SAVING = 1,
        SUCCESS = 2,
        FAILED = 3
    };

    type UploadPropertyType = {
        title: string,
        description: string,
        user: {
            phone: string,
            email: string,
            name: string
        }
    }

    function upload(formData: FormData) {
        const photos = formData.getAll('images');
        const promises = photos.map((file: any) => getImage(file)
            .then((image) => {
                return {
                    id: Date.now(),
                    originalName: file.name,
                    fileName: file.name,
                    url: image.src,
                    type: file.type
                }
            }));

        return Promise.all(promises);
    }

    function getImage(file: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const fReader = new FileReader();
            const img = document.createElement('img');

            fReader.onload = () => {
                //@ts-ignore
                img.src = fReader.result;
                resolve(img);
            }

            fReader.readAsDataURL(file);
        })
    }

    function base64ToBlob(base64: any, mime: any): Promise<Blob> {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        return new Promise((resolve) => {
            let byteArrays = [];
            for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
                var slice = byteChars.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            resolve(new Blob(byteArrays, { type: mime }));
        })

    }

    // tslint:disable no-unused-expression
    new Vue({ // eslint-disable-line no-new
        data() {
            return {
                sendDataUrl: URLS.ADD_PROPERTY,
                modalId: "modal-message",
                uploadedFiles: [],
                errors: [],
                successMessage: [],
                currentStatus: null,
                fileCount: 0,
                formInputData: {
                    title: null,
                    description: null,
                    transactionType: null,
                    propertyType: null,
                    surface: null,
                    price: null,
                    rooms: null,
                    address: null
                },
                user: {
                    shortId: null,
                    email: null
                }
            };
        },
        el: "#submitPropertyApp",
        computed: {
            isInitial: function (): boolean {
                return this.currentStatus === uploadStatus.INITIAL
            },
            isSaving: function (): boolean {
                return this.currentStatus === uploadStatus.SAVING;
            },
            isSuccess: function (): boolean {
                return this.currentStatus === uploadStatus.SUCCESS;
            },
            isFailed: function (): boolean {
                return this.currentStatus === uploadStatus.FAILED;
            }
        },
        methods: {
            handleDeleteImage: function (imageId: string) {
                // first filter out the image from this.uploadedFiles
                this.uploadedFiles = this.uploadedFiles.filter((value: any) => { return value.id !== imageId })
            },
            checkForm: function (e: Event) {
                e.preventDefault();
                this.validateForm(e)
                    .then(this.sendDataToBackend)
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        //@ts-ignore
                        $(`#${this.modalId}`).modal()
                    })

            },
            validateForm: function (e: Event) {
                return new Promise((resolve, reject) => {
                    this.errors = [];
                    this.successMessage = [];
                    if (!this.formInputData.title) {
                        //@ts-ignore
                        this.errors.push("Nu ai completat titlul");
                    }
                    //@ts-ignore
                    if (!this.formInputData.description || this.formInputData.description.length < 10) {
                        //@ts-ignore
                        this.errors.push("Adauga o descriere mai amanuntita");
                    }

                    if (this.errors.length > 0) {
                        reject("Validation error");
                    }

                    resolve("Inputs are valid");
                })
            },
            sendDataToBackend: function () {
                return new Promise(async (resolve, reject) => {
                    let formData = new FormData();
                    try {
                        this.uploadedFiles.forEach(async (file: any) => {
                            let base64Content = file.url.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                            formData.append("images", await base64ToBlob(base64Content, file.type))
                        });

                        Object.entries(this.formInputData).forEach((value) => {
                            //@ts-ignore
                            formData.append(value[0], value[1] || "");
                        })
                        let response = await tokenHeaderRequest.post(this.sendDataUrl, formData);
                        //@ts-ignore
                        this.successMessage.push("Datele au fost trimise cu succes");

                        resolve("Success");
                    } catch (err) {
                        console.log(err);
                        //@ts-ignore
                        this.errors.push("Eroare de comunicare cu serverul");
                        reject("error occured in sending data");
                    }
                })
            },
            reset: function () {
                // reset form to initial state
                //@ts-ignore
                this.currentStatus = uploadStatus.INITIAL;
                this.uploadedFiles = [];
                this.errors = [];
                this.successMessage = [];
            },
            save(formData: FormData) {
                //@ts-ignore
                this.currentStatus = uploadStatus.SAVING;
                upload(formData)
                    .then(imageObject => {
                        //@ts-ignore
                        this.uploadedFiles = [].concat(imageObject);
                        //@ts-ignore
                        this.currentStatus = uploadStatus.INITIAL;
                    })
                    .catch(err => {
                        console.log(err);
                        //@ts-ignore
                        this.errors.push("Erroare la citirea imaginii")
                        //@ts-ignore
                        this.currentStatus = uploadStatus.FAILED;
                    });
            },
            filesChange(e: InputEvent) {
                // validate file size and file type
                const formData = new FormData();
                //@ts-ignore
                let fileList = e.target.files;
                if (!fileList.length) return;
                this.errors = [];
                this.successMessage = [];
                if (!Array.prototype.every.call(fileList, validFileType)) {
                    //@ts-ignore
                    this.errors.push("Fisierul incarcat nu este o imagine");
                    //@ts-ignore
                    $(`#${this.modalId}`).modal()
                    return;
                }

                if (!Array.prototype.every.call(fileList, validFileSize)) {
                    //@ts-ignore
                    this.errors.push("Imaginea are o marime prea mare, incarca imagini de maximi: " + maxFileSize + "mb");
                    //@ts-ignore
                    $(`#${this.modalId}`).modal()
                    return;
                }

                // append the files to FormData
                //@ts-ignore
                let inputName = e.target.name;
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(inputName, fileList[x], fileList[x].name);
                    });
                this.fileCount = fileList.length;
                // save it
                this.save(formData);
            }
        },
        mounted() {
            getTokenPayload()
                .then(data => {
                    if (!data) {
                        return window.location.pathname = "/autentificare"
                    }
                    this.reset();
                    return data;
                })
                .then(payload => {
                    if (!payload) {
                        return;
                    }
                    //@ts-ignore
                    this.user.shortId = payload.shortId;
                    //@ts-ignore
                    this.user.email = payload.email;
                })
        }
    });
}
