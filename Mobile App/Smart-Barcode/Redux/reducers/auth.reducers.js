import { SIGN_OUT, SIGN_UP, SIGN_IN, LOAD_PROF, UPDATE_PROF } from "../types";

const INITIAL_STATE = {
  isSignedIn: false,
  userId: "",
  fullName: "",
  email: "",
  role: "",
  status: "",
  assignedButtons: [],
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_UP:
      return { ...state };
    case SIGN_IN:
      const { fullName, email, role, _id, status, assignedButtons } =
        action.payload;
      return {
        ...state,
        isSignedIn: true,
        fullName: fullName,
        email: email,
        role: role,
        userId: _id,
        status: status,
        assignedButtons: assignedButtons,
      };
    case LOAD_PROF:
      return {
        ...state,
        isSignedIn: true,
        fullName: action.payload.fullName,
        email: action.payload.email,
        role: action.payload.role,
        userId: action.payload.userId,
        status: action.payload.status,
        assignedButtons: action.payload.assignedButtons,
      };
    case UPDATE_PROF:
      return {
        ...state,
        isSignedIn: true,
        fullName: action.payload.fullName,
        email: action.payload.email,
        role: action.payload.role,
        userId: action.payload.userId,
        status: action.payload.status,
        assignedButtons: action.payload.assignedButtons,
      };

    case SIGN_OUT:
      return {
        INITIAL_STATE,
      };

    default:
      return { ...state };
  }
};

export default authReducer;
