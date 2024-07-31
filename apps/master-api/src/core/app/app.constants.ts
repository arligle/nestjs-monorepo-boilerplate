import "dotenv/config";

export const tokenSecret: string =
	process.env.JWT_SECRET || "dsalglkasdh870709";
export const tokenExpiresInSeconds: number =
	Number.parseInt(process.env.JWT_EXPIRES || "3600", 10) / 144;
export const tokenExpiresInDate: Date = new Date(
	(Math.floor(new Date().getTime() / 1000) + tokenExpiresInSeconds) * 1000,
);
