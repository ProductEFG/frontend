import { userStocksService } from "@/services/userStocks.service";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { user } = useAuth();

  const [enabledTabs, setEnabledTabs] = useState(() => {
    const savedState = sessionStorage.getItem("enabledTabs");
    return savedState ? JSON.parse(savedState) : 0;
  });
  const [openedCompany, setOpenedCompany] = useState(null);

  const [companyBought, setCompanyBought] = useState(null);
  const [companySold, setCompanySold] = useState(null);

  const [postBuyPosition, setPostBuyPosition] = useState(null);
  const [postSellPosition, setPostSellPosition] = useState(null);

  const handleNav = (skip, number) => {
    setEnabledTabs((prev) => {
      let newValue = prev;
      if (newValue + 1 > 6) {
        newValue = 0;

        setOpenedCompany(null);
        setCompanyBought(null);
        setCompanySold(null);
        setPostBuyPosition(null);
        setPostSellPosition(null);

        sessionStorage.removeItem("companyBought");
        sessionStorage.removeItem("companySold");
        sessionStorage.removeItem("postBuyPosition");
        sessionStorage.removeItem("postSellPosition");
      } else if (skip) {
        newValue = newValue + number;
      } else {
        newValue += 1;
      }
      sessionStorage.setItem("enabledTabs", JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const companyB = JSON.parse(sessionStorage.getItem("companyBought"));
    companyB && setCompanyBought(companyB);

    const companyS = JSON.parse(sessionStorage.getItem("companySold"));
    companyS && setCompanySold(companyS);

    const companyPostBuy = JSON.parse(
      sessionStorage.getItem("postBuyPosition")
    );
    companyPostBuy && setPostBuyPosition(companyPostBuy);

    const companyPostSell = JSON.parse(
      sessionStorage.getItem("postSellPosition")
    );
    companyPostSell && setPostSellPosition(companyPostSell);

    const savedState = sessionStorage.getItem("enabledTabs");
    setEnabledTabs(savedState ? JSON.parse(savedState) : 0);
  }, []);

  const fetchPostBuyPosition = async () => {
    try {
      const userStocksData = await userStocksService.getUserStocksByCompany(
        user._id,
        companyBought._id
      );

      let sharesQuantity = 0;
      let valueOfShares = 0;

      userStocksData.forEach((stock) => {
        sharesQuantity += stock.quantity;
        if (
          new Date(stock.createdAt).toDateString() === new Date().toDateString()
        ) {
          valueOfShares += stock.quantity * companyBought.temp_price;
        } else {
          valueOfShares += stock.quantity * companyBought.current_price;
        }
      });

      const newPosition = {
        sharesQuantity,
        valueOfShares,
        sharePrice: companyBought.current_price,
      };

      sessionStorage.setItem("postBuyPosition", JSON.stringify(newPosition));
      setPostBuyPosition(newPosition);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchPostSellPosition = async () => {
    try {
      const userStocksData = await userStocksService.getUserStocksByCompany(
        user._id,
        companySold.id
      );

      let sharesQuantity = 0;
      let valueOfShares = 0;

      userStocksData.forEach((stock) => {
        sharesQuantity += stock.quantity;
        if (
          new Date(stock.createdAt).toDateString() === new Date().toDateString()
        ) {
          valueOfShares += stock.quantity * companySold.temp_price;
        } else {
          valueOfShares += stock.quantity * companySold.price;
        }
      });

      const newPosition = {
        sharesQuantity: sharesQuantity + companySold.sold_quantity,
        valueOfShares:
          valueOfShares + companySold.sold_quantity * companySold.temp_price,
        sharePrice: companySold.price,
      };

      sessionStorage.setItem("postSellPosition", JSON.stringify(newPosition));
      setPostSellPosition(newPosition);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPostBuyPosition();
  }, [companyBought]);

  useEffect(() => {
    fetchPostSellPosition();
  }, [companySold]);

  useEffect(() => {
    const savedState = sessionStorage.getItem("enabledTabs");
    setEnabledTabs(savedState ? JSON.parse(savedState) : 0);
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        enabledTabs,
        handleNav,
        companyBought,
        setCompanyBought,
        companySold,
        setCompanySold,
        openedCompany,
        setOpenedCompany,
        postBuyPosition,
        postSellPosition,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
