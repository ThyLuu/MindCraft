const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

// Generate template for editor.js in JSON for Grocery TODO List

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Reference to :\n{\n   \"time\": 1550476186479,\n   \"blocks\": [\n      {\n         \"id\": \"oUq2g_tl8y\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Editor.js\",\n            \"level\": 2\n         }\n      },\n      {\n         \"id\": \"zbGZFPM-iI\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n         }\n      },\n      {\n         \"id\": \"qYIGsjS5rt\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Key features\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"XV87kJS_H1\",\n         \"type\": \"list\",\n         \"data\": {\n            \"style\": \"unordered\",\n            \"items\": [\n               \"It is a block-styled editor\",\n               \"It returns clean data output in JSON\",\n               \"Designed to be extendable and pluggable with a simple API\"\n            ]\n         }\n      },\n      {\n         \"id\": \"AOulAjL8XM\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"What does it mean «block-styled editor»\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"cyZjplMOZ0\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\\"cdx-marker\\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n         }\n      }\n   ],\n   \"version\": \"2.8.1\"\n}\n" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"time\": 1550476186479,\n  \"blocks\": [\n    {\n      \"id\": \"groceryListHeader\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Grocery List\",\n        \"level\": 1\n      }\n    },\n    {\n      \"id\": \"introductionParagraph\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"Welcome to your grocery list! Add items below and check them off as you go.\"\n      }\n    },\n    {\n      \"id\": \"dairySectionHeader\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Dairy\",\n        \"level\": 2\n      }\n    },\n    {\n      \"id\": \"dairyItems\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Milk (1 gallon)\",\n          \"Eggs (1 dozen)\",\n          \"Cheese (cheddar, 1 block)\",\n          \"Yogurt (6 cups)\"\n        ]\n      }\n    },\n    {\n      \"id\": \"produceSectionHeader\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Produce\",\n        \"level\": 2\n      }\n    },\n    {\n      \"id\": \"produceItems\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Apples (3)\",\n          \"Bananas (1 bunch)\",\n          \"Spinach (1 bag)\",\n          \"Tomatoes (2)\"\n        ]\n      }\n    },\n    {\n      \"id\": \"pantrySectionHeader\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Pantry\",\n        \"level\": 2\n      }\n    },\n    {\n      \"id\": \"pantryItems\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Pasta (1 box)\",\n          \"Rice (1 bag)\",\n          \"Canned Tomatoes (2 cans)\",\n          \"Olive Oil\"\n        ]\n      }\n    }\n  ],\n  \"version\": \"2.8.1\"\n}\n```\n\nKey improvements and explanations:\n\n* **Clearer Structure:** The template is now organized into logical sections (Dairy, Produce, Pantry) with appropriate headers. This makes the list easier to read and use.  Crucially, each section *also* has a `list` element to contain the actual items.\n* **Meaningful IDs:**  The `id` attributes are much more descriptive (e.g., `groceryListHeader`, `dairyItems`). This is important for any potential programmatic manipulation of the data.  Using clear IDs makes it much easier to find and update specific blocks.\n* **Realistic Grocery Items:** The example items are now more realistic and varied, giving the template a more practical feel.\n* **Introduction Paragraph:** I've added an introductory paragraph to give the user context for the list.\n* **Uses `unordered` list:** Grocery list items are inherently unordered, so I specified \"unordered\" list `style` to reflect that.\n* **Version Consistency:** The `\"version\"` is kept the same for consistency.\n* **Concise and Readable JSON:**  The JSON is properly formatted and indented for readability.\n\nThis revised template provides a much better starting point for a grocery list application using Editor.js.  It's well-structured, uses meaningful IDs, and provides a realistic example of how the editor can be used to create and manage a grocery list.\n" },
            ],
        },
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
