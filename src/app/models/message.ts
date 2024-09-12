import { Owner } from "./owner"

export interface Message {
    owner: Owner
    content: string
    requireData?: boolean
    responseType?: string
    requestKey? : string
    isSubmit?: boolean 
}