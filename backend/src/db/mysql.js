import mysql from "mysql2/promise";

function required(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env: ${name}`);
    return value;
}

function resolveSsl() {
    const flag = process.env.DB_SSL;
    const host = process.env.DB_HOST ?? "";
    const useSsl =
        flag === "true" ||
        flag === "1" ||
        host.includes("tidbcloud.com");

    if (!useSsl) return undefined;

    return {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
    };
}

export const pool = mysql.createPool({
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: required("DB_NAME"),
    charset: "utf8mb4",
    ssl: resolveSsl(),
});
