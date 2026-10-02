import "./styles.css"

const root = document.getElementById("ui-root")
if (root) {
  Promise.all([import("react-dom/client"), import("./app"), import("react")])
    .then(([{ createRoot }, { App }, { createElement }]) => {
      root.dataset.uiReady = "true"
      createRoot(root).render(createElement(App))
    })
    .catch(() => {
      const message = document.getElementById("ui-startup-message")
      if (message)
        message.textContent =
          "The interface could not load. Reload this page or check that all frontend assets were uploaded."
    })
}
