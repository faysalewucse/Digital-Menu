import { useState } from "react";
import Categories from "./Categories";
import { FoodItems } from "./FoodItems";
import { Grid, Stack } from "@mui/material";

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Dessert");

  return (
    <Grid container spacing={2} maxWidth="xl" marginX="auto" padding={5}>
      <Grid
        item
        md={2}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </Grid>
      <Grid item xs={12} md={10}>
        <FoodItems selectedCategory={selectedCategory} />
      </Grid>
    </Grid>
  );
};
