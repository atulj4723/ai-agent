import say from "say";
import chalk from "chalk";
export const speak = (text) => {
    const sanitizedResult =
        typeof text === "string" ? text.replace(/\*/g, "") : text;
    say.speak(sanitizedResult, "Microsoft Heera Desktop", 1.75);
    console.log(chalk.blueBright(`\nJarvis:${sanitizedResult}\n`));
};
