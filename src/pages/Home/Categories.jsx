import { Chip, Stack, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Container } from "postcss";

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const {
    isLoading,
    data: categories,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      return response.data.categories;
    },
  });

  const handleFoodItems = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box padding={5}>
      <Stack spacing={1} alignItems="center" justifyContent="center">
        {categories?.map((category, index) => (
          <Stack
            key={category.idCategory}
            component={motion.div}
            whileHover={{
              scale: 1.05,
            }}
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              delay: index / 30,
              duration: 0.1,
              type: "spring",
              stiffness: 20,
            }}
          >
            <Chip
              onClick={() => handleFoodItems(category.strCategory)}
              label={category.strCategory}
              sx={{
                width: 180,
                backgroundColor:
                  category.strCategory === selectedCategory
                    ? "#22c55e"
                    : "#86efac",
                paddingX: 2,
                fontSize: 15,
                borderRadius: 3,
                color:
                  category.strCategory === selectedCategory
                    ? "#ffffff"
                    : "#166534",
                "&:hover": {
                  backgroundColor: "#16a34a",
                  color: "#dcfce7",
                },
              }}
              color="success"
              clickable
            />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default Categories;
