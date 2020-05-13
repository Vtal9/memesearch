import { AuthState } from "../util/Types";
import { RouteComponentProps } from "react-router-dom";
import { WithSnackbarProps } from "notistack";


export type PageProps = {
  authState: AuthState,
} & RouteComponentProps & WithSnackbarProps

export type Page = {
  url: string,
  title: string,
  tab: boolean,
  cmp: React.ComponentClass<PageProps>,
}