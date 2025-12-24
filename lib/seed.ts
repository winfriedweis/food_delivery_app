import {ID} from "react-native-appwrite";
import {appwriteConfig, tablesDB} from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[];
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

/**
 * Löscht alle Zeilen aus einer Table
 */
async function clearTable(tableId: string): Promise<void> {
    try {
        const list = await tablesDB.listRows(
            appwriteConfig.databaseId,
            tableId
        );

        await Promise.all(
            list.rows.map((row: any) =>
                tablesDB.deleteRow(
                    appwriteConfig.databaseId,
                    tableId,
                    row.$id
                )
            )
        );
        console.log(`✅ Table ${tableId} cleared`);
    } catch (error) {
        console.error(`Error clearing table ${tableId}:`, error);
    }
}

/**
 * Lädt ein Bild von einer URL herunter (falls nötig)
 * Hinweis: Für jetzt verwenden wir die externe URL direkt
 */
async function getImageUrl(imageUrl: string): Promise<string> {
    // Falls Sie Storage später implementieren möchten:
    // const response = await fetch(imageUrl);
    // const blob = await response.blob();
    // const file = await storage.createFile(...);
    // return storage.getFileViewURL(...);

    // Für jetzt: externe URL direkt verwenden
    return imageUrl;
}

/**
 * Befüllt die Datenbank mit Dummy-Daten
 */
async function seed(): Promise<void> {
    try {
        console.log("🌱 Starting seeding...");

        // 1. Clear all tables
        console.log("🧹 Clearing tables...");
        await clearTable(appwriteConfig.categoriesTableId);
        await clearTable(appwriteConfig.customizationsTableId);
        await clearTable(appwriteConfig.menuTableId);
        await clearTable(appwriteConfig.menuCustomizationsTableId);

        // 2. Create Categories
        console.log("📂 Creating categories...");
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            const row = await tablesDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.categoriesTableId,
                ID.unique(),
                {
                    name: cat.name,
                    description: cat.description,
                }
            );
            categoryMap[cat.name] = row.$id;
            console.log(`  ✓ Created category: ${cat.name}`);
        }

        // 3. Create Customizations
        console.log("🍕 Creating customizations...");
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            const row = await tablesDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.customizationsTableId,
                ID.unique(),
                {
                    name: cus.name,
                    price: cus.price,
                    type: cus.type,
                }
            );
            customizationMap[cus.name] = row.$id;
            console.log(`  ✓ Created customization: ${cus.name}`);
        }

        // 4. Create Menu Items
        console.log("🍔 Creating menu items...");
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            // Bild-URL abrufen (aktuell nur externe URL)
            const imageUrl = await getImageUrl(item.image_url);

            const row = await tablesDB.createRow(
                appwriteConfig.databaseId,
                appwriteConfig.menuTableId,
                ID.unique(),
                {
                    name: item.name,
                    description: item.description,
                    image_url: imageUrl,
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protein: item.protein,
                    category_id: categoryMap[item.category_name], // Foreign Key zur Category
                }
            );

            menuMap[item.name] = row.$id;
            console.log(`  ✓ Created menu item: ${item.name}`);

            // 5. Create menu_customizations (Junction Table)
            for (const cusName of item.customizations) {
                await tablesDB.createRow(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCustomizationsTableId,
                    ID.unique(),
                    {
                        menu_id: row.$id, // Foreign Key zum Menu Item
                        customization_id: customizationMap[cusName], // Foreign Key zur Customization
                    }
                );
            }
        }

        console.log("✅ Seeding complete!");
        console.log(`   - ${Object.keys(categoryMap).length} categories created`);
        console.log(`   - ${Object.keys(customizationMap).length} customizations created`);
        console.log(`   - ${Object.keys(menuMap).length} menu items created`);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}

export default seed;
