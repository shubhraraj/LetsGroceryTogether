const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Produce": [
    "avocado", "carrot", "celery", "lettuce", "spinach", "apple", "banana",
    "tomato", "cucumber", "onion", "garlic", "pepper", "broccoli", "kale",
    "lemon", "lime", "orange", "mango", "grape", "strawberry", "salad",
    "herb", "basil", "cilantro", "berry", "zucchini", "asparagus", "mushroom",
  ],
  "Dairy": ["milk", "cheese", "yogurt", "butter", "cream", "egg", "eggs"],
  "Meat / Seafood": [
    "chicken", "beef", "pork", "salmon", "fish", "shrimp", "turkey",
    "steak", "lamb", "tuna", "tilapia", "sausage", "bacon",
  ],
  "Bread / Bakery": ["bread", "bagel", "muffin", "tortilla", "roll", "bun", "croissant", "pita"],
  "Snacks": [
    "chip", "cracker", "popcorn", "pretzel", "granola", "bar",
    "cookie", "candy", "chocolate", "nuts", "trail mix",
  ],
  "Alcohol": ["beer", "wine", "whiskey", "vodka", "gin", "rum", "tequila", "alcohol", "cider"],
  "Beverages": ["juice", "soda", "water", "coffee", "tea", "kombucha", "sparkling", "lemonade"],
  "Toiletries": [
    "toilet", "shampoo", "conditioner", "soap", "toothpaste",
    "deodorant", "razor", "lotion", "moisturizer", "sunscreen", "floss",
  ],
  "Cleaning Supplies": [
    "detergent", "bleach", "cleaner", "sponge", "paper towel",
    "trash bag", "dish soap", "windex",
  ],
};

const FREQUENCY_BY_CATEGORY: Record<string, { frequency: string; days: number }> = {
  "Produce":           { frequency: "weekly",   days: 7  },
  "Dairy":             { frequency: "weekly",   days: 7  },
  "Meat / Seafood":    { frequency: "weekly",   days: 7  },
  "Bread / Bakery":    { frequency: "weekly",   days: 7  },
  "Snacks":            { frequency: "biweekly", days: 14 },
  "Alcohol":           { frequency: "biweekly", days: 14 },
  "Beverages":         { frequency: "biweekly", days: 14 },
  "Pantry / Canned":   { frequency: "monthly",  days: 30 },
  "Toiletries":        { frequency: "monthly",  days: 30 },
  "Cleaning Supplies": { frequency: "monthly",  days: 30 },
};

export function detectCategory(itemName: string): string {
  const lower = itemName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "Pantry / Canned";
}

export function getFrequencyForCategory(category: string): { frequency: string; days: number } {
  return FREQUENCY_BY_CATEGORY[category] ?? { frequency: "monthly", days: 30 };
}
