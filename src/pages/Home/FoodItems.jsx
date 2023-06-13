import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export const FoodItems = ({ selectedCategory }) => {
  const [url, setUrl] = useState(
    `${import.meta.env.VITE_CATEGORY_SEARCH_API}${selectedCategory}`
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMeal, setSearchMeal] = useState(1);

  const {
    isLoading,
    data: foodData = [],
    isError,
    refetch,
  } = useQuery({
    queryKey: ["foodItems", selectedCategory],
    queryFn: async () => {
      const response = await axios.get(url);
      const meals = response.data.meals || [];
      const startIndex =
        (currentPage - 1) * import.meta.env.VITE_FOODITEMS_PER_PAGE;
      const endIndex = startIndex + import.meta.env.VITE_FOODITEMS_PER_PAGE;
      return {
        length: meals.length,
        foodItems: meals.slice(startIndex, endIndex),
      };
    },
  });

  useEffect(() => {
    // Call refetch whenever the searchValue changes
    refetch();
  }, [selectedCategory, refetch, currentPage, url]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleSearch = (event) => {
    setSearchMeal(event.target.value);

    if (event.target.value === "")
      return setUrl(
        `${import.meta.env.VITE_CATEGORY_SEARCH_API}${selectedCategory}`
      );
    setUrl(`${import.meta.env.VITE_FOOD_SEARCH_API}${searchMeal}`);
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <TextField
          label="Search Food"
          variant="outlined"
          color="success"
          size="small"
          focused
          sx={{ marginBottom: 2, width: "30%" }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
          onKeyDown={handleSearch}
        />
        <Grid container spacing={5} columns={{ xs: 12, sm: 4, md: 9, lg: 16 }}>
          {foodData?.foodItems?.map((food) => (
            <Grid item xs={12} sm={2} md={3} lg={4} key={food.idMeal}>
              <Card
                key={food.idMeal}
                sx={{
                  height: 350,
                  borderRadius: 5,
                  border: "7px solid #22c55e",
                  boxShadow: "5px 5px 20px 5px rgba(0,0,0,0.1)",
                }}
              >
                <CardMedia
                  sx={{ height: 200 }}
                  component="img"
                  image={food.strMealThumb}
                  alt={food.strMeal}
                />
                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="body"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    {food.strMeal}
                  </Typography>
                  <Typography
                    sx={{ color: "green" }}
                    variant="body"
                    fontWeight="bold"
                  >
                    Price: 250Tk
                  </Typography>
                  <Typography sx={{ color: "gray" }} variant="body2">
                    This is a healthy Food. Which can produce vitamine to your
                    body.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Stack spacing={2} marginTop={5}>
          <Pagination
            variant="outlined"
            color="success"
            count={Math.ceil(
              foodData.length / import.meta.env.VITE_FOODITEMS_PER_PAGE
            )}
            onChange={(e, page) => setCurrentPage(page)}
            shape="rounded"
          />
        </Stack>
      </Container>
    </Box>
  );
};
