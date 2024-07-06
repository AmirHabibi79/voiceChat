import htmx from "htmx.org";
import App from "./src/app";
import "./main.css";
function main() {
  htmx.config.selfRequestsOnly = false;
  window.htmx = htmx;
  App();
}

main();
