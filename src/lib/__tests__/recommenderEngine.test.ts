import { scoreProduct } from "../../recommenderEngine";

describe("recommenderEngine", () => {
  test("producto saludable obtiene un score alto", () => {
    const product = {
      nutriscore_grade: "a",
      nova_group: 1,
      nutriments: {
        sugars_100g: 2,
        saturated_fat_100g: 1,
        salt_100g: 0.5,
      },
      ingredients_text: "agua, tomate, sal",
    };

    const score = scoreProduct(product, {
      maxNova: 3,
      excludedIngredients: [],
    });

    expect(score).toBeGreaterThan(75);
  });

  test("producto ultraprocesado obtiene score bajo", () => {
    const product = {
      nutriscore_grade: "e",
      nova_group: 4,
      nutriments: {
        sugars_100g: 25,
        saturated_fat_100g: 10,
        salt_100g: 2,
      },
      ingredients_text: "azúcar, aceite de palma, conservantes",
    };

    const score = scoreProduct(product);

    expect(score).toBeLessThan(40);
  });

  test("si contiene ingredientes excluidos penaliza fuerte", () => {
    const product = {
      nutriscore_grade: "b",
      nova_group: 2,
      nutriments: {
        sugars_100g: 10,
      },
      ingredients_text: "leche descremada, cacao",
    };

    const score = scoreProduct(product, {
      excludedIngredients: ["leche"],
    });

    // penalización por ingrediente excluido debería bajar bastante el score
    expect(score).toBeLessThan(50);
  });

  test("respeta maxNova de preferencias", () => {
    const product = {
      nutriscore_grade: "b",
      nova_group: 4, // mayor al permitido
      nutriments: {},
      ingredients_text: "harina, aceite",
    };

    const score = scoreProduct(product, {
      maxNova: 2,
    });

    // la penalización debe ser notable
    expect(score).toBeLessThan(50);
  });
});
