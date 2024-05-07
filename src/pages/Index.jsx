import { Box, Container, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const gridSize = 20;
const gridCount = 25;

const Index = () => {
  const toast = useToast();
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);
  const [bgColor, setBgColor] = useState("gray.800");

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prev) => {
        let newSnake = [...prev];
        let head = { ...newSnake[newSnake.length - 1] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        if (head.x >= gridCount) head.x = 0;
        if (head.y >= gridCount) head.y = 0;
        if (head.x < 0) head.x = gridCount - 1;
        if (head.y < 0) head.y = gridCount - 1;

        newSnake.push(head);
        newSnake.shift();

        return newSnake;
      });
    };

    const checkCollision = () => {
      const [head] = snake.slice(-1);
      if (head.x === food.x && head.y === food.y) {
        setSnake((prev) => [...prev, food]);
        placeFood();
        toast({
          title: "Awesome!",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        changeBackgroundColor();
      }
    };

    const gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food]);

  const placeFood = () => {
    const x = Math.floor(Math.random() * gridCount);
    const y = Math.floor(Math.random() * gridCount);
    setFood({ x, y });
  };

  const changeBackgroundColor = () => {
    const colors = ["gray.800", "red.500", "blue.500", "green.500", "purple.500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  };

  return (
    <Container maxW="container.md" centerContent>
      <Box w="500px" h="500px" bg={bgColor} position="relative">
        {snake.map((segment, index) => (
          <Box key={index} position="absolute" top={`${segment.y * (500 / gridCount)}px`} left={`${segment.x * (500 / gridCount)}px`} w={`${500 / gridCount}px`} h={`${500 / gridCount}px`} bg="green.500" />
        ))}
        <Box position="absolute" top={`${food.y * (500 / gridCount)}px`} left={`${food.x * (500 / gridCount)}px`} w={`${500 / gridCount}px`} h={`${500 / gridCount}px`} fontSize="xl" textAlign="center" lineHeight={`${500 / gridCount}px`}>
          😊
        </Box>
      </Box>
    </Container>
  );
};

export default Index;
