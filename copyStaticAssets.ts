import * as shell from "shelljs";

shell.cp("-R", "src/public/js", "dist/public/js/");
shell.cp("-R", "src/public/webfonts", "dist/public/webfonts");
shell.cp("-R", "src/public/layerslider", "dist/public/layerslider");
shell.cp("-R", "src/public/img", "dist/public/img");
shell.cp("-R", "src/public/css", "dist/public/css");
