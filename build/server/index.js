import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useRef } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        alert("Please upload a valid PDF file");
      }
    } else {
      alert("No file selected.");
    }
  };
  const handleUpload = async () => {
    if (!pdfFile) {
      alert("No file selected!");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    try {
      const response = await fetch("https://testify-backend-zxg4.onrender.com/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      console.log("Server response:", data.questions);
      setQuizQuestions(data.questions);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleImageClick = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      className: "mt-5 ml-10 text-5xl text-blue-700",
      children: "TESTify"
    }), /* @__PURE__ */ jsx("p", {
      className: "ml-10",
      children: "Test your knowledge"
    }), /* @__PURE__ */ jsxs("div", {
      className: "m-25 justify-items-center",
      children: [/* @__PURE__ */ jsx("img", {
        className: "w-35",
        src: "../../upload-solid.svg",
        alt: "",
        onClick: handleImageClick
      }), /* @__PURE__ */ jsx("h6", {
        className: "text-center m-3 text-5xl",
        onClick: handleImageClick,
        children: "Upload your PDF file"
      }), /* @__PURE__ */ jsx("input", {
        className: "hidden",
        ref: fileInputRef,
        type: "file",
        accept: "application/pdf",
        onChange: handleFileChange
      }), pdfFile && /* @__PURE__ */ jsxs("p", {
        className: "ml-10 mt-2 text-gray-700",
        children: ["Selected PDF: ", pdfFile.name]
      }), /* @__PURE__ */ jsx("button", {
        onClick: handleUpload,
        className: "bg-blue-500 text-white px-4 py-2 rounded mt-4",
        children: "Generate Questions"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-6 ml-10",
      children: quizQuestions && quizQuestions.length > 0 && /* @__PURE__ */ jsx("div", {
        children: quizQuestions.map((q, index) => /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            children: q.question
          }), q.options.map((option, i) => /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("input", {
              type: "radio",
              name: `q-${index}`,
              value: option
            }), /* @__PURE__ */ jsx("label", {
              children: option
            })]
          }, i))]
        }, index))
      })
    })]
  });
};
const home$1 = withComponentProps(home);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home$1
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-SQZkSKxz.js", "imports": ["/assets/chunk-D4RADZKF-BXVSF3ox.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DWqEeFm1.js", "imports": ["/assets/chunk-D4RADZKF-BXVSF3ox.js", "/assets/with-props-BMOtgW5C.js"], "css": ["/assets/root-Fp-pdkbL.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-Biiu6ueo.js", "imports": ["/assets/with-props-BMOtgW5C.js", "/assets/chunk-D4RADZKF-BXVSF3ox.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-ba57f7ca.js", "version": "ba57f7ca", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
