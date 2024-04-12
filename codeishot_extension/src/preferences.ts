import { useConfig } from "./utils";

function isAuthApproved(): boolean {
  let config = useConfig();
  let userChoice: boolean | undefined = config.get("Authentication");

  return userChoice || false;
}

export { isAuthApproved };
