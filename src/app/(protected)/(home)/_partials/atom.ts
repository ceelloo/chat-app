import { atom } from "jotai";
import { GetUsers } from "./action";

export const isNewConversationAtom = atom<boolean>(false);
export const selectedUserAtom = atom<GetUsers[number] | null>(null);
