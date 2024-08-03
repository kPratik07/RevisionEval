import { useContext, useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Image, Input, Text, useToast, Button } from "@chakra-ui/react";
import { CountryCard } from "../components/CountryCard";
import { DataContext } from "../context/DataContext";

const Home = () => {
  const [searchData, setSearchData] = useState("");
  const { dataList, setDataList, historyList, setHistoryList } = useContext(DataContext);
  const searchInputBox = useRef(null);
  const toast = useToast();

  useEffect(() => {
    searchInputBox.current.focus();
  }, []);

  const handleChange = (e) => {
    setSearchData(e.target.value);
  };

  const fetchCountryData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Country not found");
      }
      const data = await response.json();
      toast({
        title: "Data fetched successfully",
        status: "success",
        duration: 3000,
        position: "center",
        isClosable: true,
      });
      setDataList(data);
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 3000,
        position: "center",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    let id = null;
    if (searchData !== "") {
      id = setTimeout(() => {
        const newHistory = [...historyList];
        if (newHistory.length >= 5) {
          newHistory.pop();
        }
        newHistory.unshift(searchData);
        setHistoryList(newHistory);
        fetchCountryData(`https://restcountries.com/v3.1/currency/${searchData}`);
      }, 600);
    }
    return () => clearTimeout(id);
  }, [searchData]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      mt={{ base: "60px", md: "80px" }}
      p={{ base: "4", md: "8" }}
      bgGradient="linear(to-br, #FFDEE9, #B5FFFC)"
      minH={"100vh"}
      overflowX={"hidden"}
    >
      <Heading
        mb={{ base: "4", md: "8" }}
        fontSize={{ base: "2xl", md: "4xl" }}
        color={"#00796b"}
        textAlign={"center"}
        fontWeight={"bold"}
        textShadow={"2px 2px 4px rgba(0, 0, 0, 0.2)"}
      >
        Discover and Learn About Countries 🌍
      </Heading>
      <Box
        w={{ base: "90%", md: "70%", lg: "50%" }}
        maxW={"600px"}
        mb={"20px"}
        bg={"white"}
        boxShadow={"lg"}
        borderRadius={"md"}
        overflow={"hidden"}
      >
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search for countries by currency..."
          ref={searchInputBox}
          value={searchData}
          onChange={handleChange}
          size={"lg"}
          p={"6"}
          borderRadius={"md"}
          borderColor={"#00796b"}
          _placeholder={{ color: "#004d40" }}
          _focus={{ borderColor: "#004d40", boxShadow: "0 0 0 2px #004d40" }}
        />
      </Box>
      {dataList.length === 0 ? (
        <Flex
          align={"center"}
          direction={"column"}
          justifyContent={"center"}
          mt={"20px"}
          p={"4"}
          bg={"white"}
          borderRadius={"md"}
          boxShadow={"xl"}
          maxW={"90%"}
          mb={"20px"}
        >
          <Heading mb={"4"} fontSize={{ base: "xl", md: "2xl" }} color={"#00796b"}>
            Welcome to WorldApp!
          </Heading>
          <Image
            src="https://www.lifewire.com/thmb/e2nvAeGwK5yoVXFvFypLjUwbHWY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-1047578412-692fa117cf86450287d8873eeb1a95c8-aa8d654cec814174a9e07bdae85a1eb7.jpg"
            alt="World Map"
            height={"300px"}
            objectFit={"cover"}
            borderRadius={"md"}
            mb={"4"}
            boxShadow={"md"}
          />
          <Text fontSize={{ base: "sm", md: "md" }} color={"#004d40"} mb={"4"}>
            Explore countries around the world based on their currencies. Just type in a currency to start searching!
          </Text>
          <Button
            onClick={() => setSearchData("")}
            colorScheme="teal"
            variant="solid"
            size="lg"
            mb={"4"}
          >
            Clear Search
          </Button>
        </Flex>
      ) : (
        <Flex
          wrap={"wrap"}
          gap={{ base: "10px", md: "20px" }}
          mt={"20px"}
          p={{ base: "5px", md: "20px" }}
          justifyContent={"center"}
        >
          {dataList &&
            dataList.length > 0 &&
            dataList.map((item, index) => (
              <CountryCard key={index} item={item} />
            ))}
        </Flex>
      )}
    </Box>
  );
};

export { Home };
