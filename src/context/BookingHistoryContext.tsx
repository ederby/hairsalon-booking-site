import { createContext, ReactNode, useContext, useReducer } from "react";

type BookingHistoryContextType =
  | (StateType & {
      setOpenDialog: () => void;
      setCurrentBookingID: (id: number, bookAgain: boolean) => void;
      setCurrentSorted: (
        sorted: "date" | "service" | "status" | "customerName"
      ) => void;
      setOpenAlertDialog: () => void;
    })
  | undefined;

type StateType = {
  openDialog: boolean;
  currentBookingID: number | null;
  currentSorted: string | null;
  bookAgain: boolean;
  openAlertDialog: boolean;
};

type ActionType =
  | {
      type: "SET_BOOKING";
    }
  | {
      type: "SET_BOOKINGID";
      payload: {
        id: number;
        bookAgain: boolean;
      };
    }
  | {
      type: "SET_SORTED";
      payload: "date" | "service" | "status" | "customerName";
    }
  | {
      type: "SET_DELTE_BOOKING";
    };

type BookingHistoryProviderProps = {
  children: ReactNode;
};

const BookingHistoryContext =
  createContext<BookingHistoryContextType>(undefined);

const initialState = {
  openDialog: false,
  currentBookingID: null,
  currentSorted: null,
  bookAgain: false,
  openAlertDialog: false,
};

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case "SET_BOOKING":
      return { ...state, openDialog: !state.openDialog };
    case "SET_BOOKINGID":
      return {
        ...state,
        currentBookingID: action.payload.id,
        bookAgain: action.payload.bookAgain,
      };
    case "SET_SORTED":
      return { ...state, currentSorted: action.payload };
    case "SET_DELTE_BOOKING":
      return { ...state, openAlertDialog: !state.openAlertDialog };
    default:
      return state;
  }
}

export default function BookingHistoryProvider({
  children,
}: BookingHistoryProviderProps) {
  const [
    { openDialog, currentBookingID, currentSorted, bookAgain, openAlertDialog },
    dispatch,
  ] = useReducer(reducer, initialState);

  function setOpenDialog() {
    dispatch({ type: "SET_BOOKING" });
  }
  function setCurrentBookingID(id: number, bookAgain: boolean) {
    dispatch({ type: "SET_BOOKINGID", payload: { id, bookAgain } });
  }
  function setCurrentSorted(
    sorted: "date" | "service" | "status" | "customerName"
  ) {
    dispatch({ type: "SET_SORTED", payload: sorted });
  }
  function setOpenAlertDialog() {
    dispatch({ type: "SET_DELTE_BOOKING" });
  }

  return (
    <BookingHistoryContext.Provider
      value={{
        bookAgain,
        openDialog,
        setOpenDialog,
        currentBookingID,
        setCurrentBookingID,
        currentSorted,
        setCurrentSorted,
        openAlertDialog,
        setOpenAlertDialog,
      }}
    >
      {children}
    </BookingHistoryContext.Provider>
  );
}

export function useBookingHistory() {
  const context = useContext(BookingHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useBookingHistory must be used within a BookingHistoryProvider"
    );
  }
  return context;
}
