import {Account, Avatars, Client, ID, TablesDB} from "react-native-appwrite";
import {CreateUserParams, User} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.winfriedweis.fooddeliveryapp",
    databaseId: "693fe308003869df3b88",
    userTableId: "user"
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const tablesDB = new TablesDB(client); // NEU: TablesDB statt Databases - Appwrite Update
export const avatars = new Avatars(client);

/**
 * Erstellt einen neuen Benutzer mit Account und Datenbank-Eintrag
 * @param email - E-Mail des Benutzers
 * @param password - Passwort (min. 8 Zeichen)
 * @param name - Vollständiger Name des Benutzers
 * @returns User-Row aus der Datenbank
 */

export const createUser = async ({
                                     email,
                                     password,
                                     name
                                 }: CreateUserParams) => {
    try {
        // Account erstellen (Auth)
        const newAccount = await account.create({
            userId: ID.unique(),
            email: email,
            password: password,
            name: name
        });

        if (!newAccount || !newAccount.$id) {
            throw new Error("Failed to create account");
        }

        // Avatar URL generieren VOR Datenbank-Insert
        const avatarUrl = avatars.getInitialsURL(name);

        // Benutzer anmelden
        await signInWithEmail({email, password});

        // User-Row in der neuen Tables API erstellen (statt createDocument)
        const userRow = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: newAccount.$id, // accountId als Primary Key verwenden
            data: {
                accountId: newAccount.$id, // Redundant aber für Queries nützlich
                email: email,
                name: name,
                avatar: avatarUrl
                // $createdAt und $updatedAt werden automatisch gesetzt
            }
        });

        if (!userRow) {
            throw new Error("Failed to create user row");
        }

        return userRow;

    } catch (error) {
        console.error("[createUser] Error:", error);

        const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : 'Unknown error occurred';

        throw new Error(`Failed to create user: ${errorMessage}`);
    }
}

/**
 * ✅ Meldet einen Benutzer mit E-Mail und Passwort an
 * @param email - E-Mail des Benutzers
 * @param password - Passwort des Benutzers
 * @returns Session-Objekt mit Session-Token
 */

export const signInWithEmail = async ({
                                          email,
                                          password
                                      }: {
    email: string;
    password: string;
}) => {
    try {
        // createEmailPasswordSession erwartet ein Objekt (nicht zwei separate Parameter wie vor Appwrite Update)
        const session = await account.createEmailPasswordSession({
            email: email,
            password: password
        });

        if (!session || !session.$id) {
            throw new Error("Failed to create session");
        }

        return session;

    } catch (error) {
        console.error("[signInWithEmail] Error:", error);

        const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : 'Authentication failed';

        throw new Error(`Sign in failed: ${errorMessage}`);
    }
}

// Hinter async() Promise hinzugefügt
// const userRow bekommt Typen "as User"

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const currentAccount = await account.get();

        const userRow = await tablesDB.getRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: currentAccount.$id
        }) as User;

        return userRow;
    } catch (error: any) {
        // Damit wird guest session graceful gehandelt todo remove log
        console.log("[getCurrentUser] Not authenticated (this is expected):", error.message);
        return null;
    }
}

