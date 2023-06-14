import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Modal,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LazyLoad from "react-lazy-load";
import ReactPlayer from "react-player";
import { HashLoader } from "react-spinners";

export const FoodItems = ({ selectedCategory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [foodDetails, setFoodDetails] = useState(null);

  // For Modal
  const [open, setOpen] = useState(false);
  const handleOpen = async (foodId) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`
      );
      setFoodDetails(response.data.meals[0]);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching food details:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: { sm: "50%", xs: "80%" },
    display: { md: "flex" },
    aligItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
    width: { sm: "50vw", xs: "90vw" },
    bgcolor: "background.paper",
    border: "5px solid #22c55e",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    outline: "none",
    overflowY: { xs: "auto" },
  };
  // For Modal

  const {
    isLoading,
    data: foodData = [],
    refetch,
  } = useQuery({
    queryKey: ["foodItems", selectedCategory, currentPage, searchValue],
    queryFn: async () => {
      let response;
      if (searchValue) {
        response = await axios.get(
          `${import.meta.env.VITE_FOOD_SEARCH_API}${searchValue}`
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_CATEGORY_SEARCH_API}${selectedCategory}`
        );
      }

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
    refetch();
  }, [searchValue, currentPage]);

  useEffect(() => {
    setSearchValue();
    refetch();
  }, [selectedCategory]);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setSearchValue(event.target.value);
    }
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
          sx={{
            marginBottom: 2,
            width: { md: "30%", sm: "100%", xs: "100%" },
          }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
          onKeyDown={handleSearch}
        />
      </Container>
      {!isLoading ? (
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 4, md: 9, lg: 16 }}
          >
            {foodData?.foodItems?.map((food) => (
              <Grid
                item
                xs={12}
                sm={2}
                md={3}
                lg={4}
                key={food.idMeal}
                component={motion.div}
                whileHover={{ scale: 1.05, cursor: "pointer" }}
                onClick={() => handleOpen(food.idMeal)}
              >
                <Card
                  key={food.idMeal}
                  sx={{
                    height: 350,
                    borderRadius: 5,
                    border: "7px solid #22c55e",
                    boxShadow: "5px 5px 20px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <LazyLoad>
                    <CardMedia
                      sx={{ height: 200 }}
                      component="img"
                      image={food.strMealThumb}
                      alt={food.strMeal}
                    />
                  </LazyLoad>
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
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
                      Price: {Math.ceil(foodDetails?.idMeal / 3000) * 5} BDT
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
              onChange={(_, page) => setCurrentPage(page)}
              shape="rounded"
            />
          </Stack>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                sx={{
                  width: { xs: "100%" },
                  height: { sm: "100%", xs: "30%" },
                }}
              >
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={foodDetails?.strYoutube}
                />
              </Box>
              <CardContent
                sx={{
                  display: "flex",
                  textAlign: { xs: "center" },
                  flexDirection: "column",
                  width: { sm: "50%" },
                }}
              >
                <Typography
                  variant="body"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {foodDetails?.strMeal}
                </Typography>
                <Typography
                  sx={{ color: "green" }}
                  variant="body"
                  fontWeight="bold"
                >
                  Price: {Math.ceil(foodDetails?.idMeal / 3000) * 5} BDT
                </Typography>
                <Typography
                  sx={{ color: "tomato" }}
                  variant="body"
                  fontWeight="bold"
                >
                  Preperation Time:
                  {Math.ceil(
                    (foodDetails?.idMeal / 20000) * Math.random() * 10
                  )}{" "}
                  Minutes
                </Typography>
                <Typography sx={{ color: "red", marginTop: 1 }} variant="body">
                  How to
                </Typography>
                <Typography
                  sx={{
                    height: 100,
                    overflow: "hidden",
                  }}
                  variant="body2"
                >
                  {foodDetails?.strInstructions}
                </Typography>
                <Typography
                  marginTop={2}
                  sx={{ color: "green" }}
                  variant="body"
                >
                  Ingredients
                </Typography>
                <Box
                  sx={{
                    color: "gray",
                    display: "flex",
                    flexWrap: "wrap",
                    "& > *:not(:last-child)": {
                      marginRight: 2,
                    },
                    justifyContent: { xs: "center" },
                  }}
                  variant="body"
                >
                  {[...Array(10).keys()].map((number) => {
                    const ingredient =
                      foodDetails?.["strIngredient" + (number + 1)];

                    if (ingredient) {
                      return (
                        <Typography key={number} variant="body">
                          {number + 1}. {ingredient}
                        </Typography>
                      );
                    }

                    return null;
                  })}
                </Box>
              </CardContent>
            </Box>
          </Modal>
        </Container>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
          }}
        >
          <HashLoader
            color="green"
            loading={isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      )}
    </Box>
  );
};
