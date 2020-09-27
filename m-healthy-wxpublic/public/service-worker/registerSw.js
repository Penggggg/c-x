export default function() {
    if ("serviceWorker" in navigator) {
        console.log(
          "？？？？？？？？？？？？？？？",
          navigator.serviceWorker
        );
        navigator.serviceWorker
          .register(`/service-worker?t=1566994109000`, { scope: "/" })
          .then(registration => {
            // 注册成功
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
            navigator.serviceWorker.controller &&
              navigator.serviceWorker.controller.postMessage(
                "hello serviceWorker"
              );
          })
          .catch(err => {
            // 注册失败:(
            console.error("ServiceWorker registration failed: ", err);
          });
        // });
        navigator.serviceWorker.addEventListener("message", function(event) {
          console.log(
            `%c Service-worker`,
            "color:white;font-weight:bold;background:#02A9E0;padding: 2px 6px;border-radius:4px;",
            `拦截URL：${event.data}`
          );
        });
      } else {
        console.error("Dose not support sw: ");
      }
}