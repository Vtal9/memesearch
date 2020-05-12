import { AuthState } from "../util/Types";
import { RouteComponentProps } from "react-router-dom";


export type PageProps = {
  authState: AuthState,
} & RouteComponentProps

export type Page = {
  url: string,
  title: string,
  tab: boolean,
  cmp: React.ComponentClass<PageProps>,
}