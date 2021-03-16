import * as shell from "shelljs";

shell.mkdir("dist/public");
shell.mkdir("dist/public/js");
shell.cp("-R", "src/public/js/lib", "dist/public/js/lib");
shell.cp("-R", "src/public/webfonts", "dist/public/webfonts");
shell.cp("-R", "src/public/layerslider", "dist/public/layerslider");
shell.cp("-R", "src/public/img", "dist/public/img");
shell.cp("-R", "src/public/css", "dist/public/css");
