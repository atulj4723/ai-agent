import figlet from "figlet";
import chalk from "chalk";

export const printBanner = () => {
    console.log(chalk.cyan(figlet.textSync("J.A.R.V.I.S", { horizontalLayout: "full" })));
};
