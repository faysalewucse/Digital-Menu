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
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10; //env variable

export const FoodItems = ({ selectedCategory }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    data: foodData = [],
    isError,
    refetch,
  } = useQuery({
    queryKey: ["foodItems", selectedCategory],
    queryFn: async () => {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      );
      const meals = response.data.meals || [];
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      return {
        length: meals.length,
        foodItems: meals.slice(startIndex, endIndex),
      };
    },
  });

  useEffect(() => {
    // Call refetch whenever the searchValue changes
    refetch();
  }, [selectedCategory, refetch, currentPage]);

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

  return (
    <Box paddingY={5}>
      <Container maxWidth="xl">
        <Grid container spacing={5} columns={{ xs: 2, sm: 8, md: 16 }}>
          {foodData?.foodItems?.map((food) => (
            <Grid item xs={2} sm={4} md={4} key={food.idMeal}>
              <Card
                key={food.idMeal}
                sx={{
                  maxWidth: 345,
                  height: 315,
                  borderRadius: 5,
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
            count={Math.ceil(foodData.length / PAGE_SIZE)}
            onChange={(e, page) => setCurrentPage(page)}
            shape="rounded"
          />
        </Stack>
      </Container>
    </Box>
  );
};
