import axios from "axios";
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();

import React, { createContext, FC, useEffect, useReducer } from "react";
import { IUser } from "../types";

interface IContext {
  setAuth: React.Dispatch<IAuth>;
}

export const AuthContext = createContext<IContext & IAuth>(
  {} as IContext & IAuth
);

interface IAuth {
  isAuth?: boolean;
  aToken?: string;
  user?: IUser;
  rToken?: string;
}

export const AuthProvider: FC = ({ children }) => {
  const [auth, setAuth] = useReducer<React.Reducer<IAuth, IAuth>>(
    (prevAuth, newAuth) => {
      return { ...prevAuth, ...newAuth };
    },
    { isAuth: false, aToken: "", rToken: "" }
  );
  useEffect(() => {
    if (auth.rToken) {
      storage.set("rToken", auth.rToken);
    }
  }, [auth.rToken]);

  useEffect(() => {
    let token = storage.getString("rToken");
    setAuth({ rToken: token });
    axios
      .get("/refresh", { params: { refreshToken: token } })
      .then(({ data }) => {
        console.log(data);

        if (data.aToken) {
          setAuth({ aToken: data.aToken, isAuth: true, user: data.user });
          axios.defaults.headers.common = { authorization: data.aToken };
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ setAuth, ...auth }}>
      {children}
    </AuthContext.Provider>
  );
};
