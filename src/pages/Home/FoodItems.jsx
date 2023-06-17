import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Pagination,
  Select,
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
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [foodDetails, setFoodDetails] = useState(null);
  const [dietItems, setDietItems] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDietItems(typeof value === "string" ? value.split(",") : value);
  };

  const names = ["Milk", "Suger", "Gluten", "Dairy", "Butter"];

  // For Modal
  const [open, setOpen] = useState(false);
  const handleOpen = async (foodId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FOOD_DETAILS_API}${foodId}`
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

  const applyDietFilter = async () => {
    setLoading(true);
    let filteredFoodId = [];
    for (let i = 0; i < foodData.foodItems.length; i++) {
      const response = await axios.get(
        `${import.meta.env.VITE_FOOD_DETAILS_API}${
          foodData.foodItems[i].idMeal
        }`
      );

      [...Array(20).keys()].map((_, index) => {
        const ingredient =
          response?.data?.meals[0]["strIngredient" + (index + 1)];

        if (ingredient && dietItems.includes(ingredient)) {
          filteredFoodId.push(response?.data?.meals[0].idMeal);
        }
      });
    }

    setLoading(false);
  };

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
      <Container
        maxWidth="xl"
        sx={{
          marginBottom: 5,
          display: { md: "flex" },
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          label="Search Food"
          variant="outlined"
          color="success"
          size="small"
          focused
          sx={{
            width: { md: "30%", sm: "100%", xs: "100%" },
          }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
          onKeyDown={handleSearch}
        />
        <Box display="flex" width="100%" sx={{ marginTop: { md: 0, xs: 2 } }}>
          <FormControl
            sx={{
              width: "100%",
            }}
          >
            <InputLabel
              sx={{
                marginLeft: { md: 2.5, xs: 0.5 },
              }}
              size="small"
              id="demo-multiple-checkbox-label"
            >
              Diet Filter
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              size="small"
              color="success"
              sx={{
                borderRadius: 2,
              }}
              value={dietItems}
              onChange={handleChange}
              input={<OutlinedInput label="Diet Filter" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={dietItems.indexOf(name) > -1} />
                  <ListItemText primary={name + " free"} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            color="success"
            sx={{ width: "100px", marginLeft: 1, borderRadius: 2 }}
            variant="outlined"
            onClick={applyDietFilter}
          >
            Apply
          </Button>
        </Box>
      </Container>
      {!isLoading && !loading ? (
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 4, md: 9, lg: 16 }}
          >
            {foodData?.foodItems?.map((food, index) => (
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
                sx={{ position: "relative" }}
              >
                <Chip
                  sx={{
                    position: "absolute",
                    right: 0,
                    marginTop: 2,
                    marginRight: 2,
                    backgroundColor: "#dcfce7",
                    color: "green",
                  }}
                  label="Available"
                />
                <Card
                  key={food.idMeal}
                  sx={{
                    height: 350,
                    borderRadius: 5,
                    border: "7px solid #22c55e",
                    boxShadow: "5px 5px 20px 5px rgba(0,0,0,0.2)",
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
                      Price:{" "}
                      {Math.ceil(food?.idMeal / 3000) *
                        5 *
                        Math.ceil(Math.random() * 10)}{" "}
                      BDT
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
            loading={isLoading || loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      )}
    </Box>
  );
};
