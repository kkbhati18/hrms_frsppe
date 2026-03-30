// vite.config.js
import { defineConfig } from "file:///D:/WorkPlace/node/hrms_frsppe/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/WorkPlace/node/hrms_frsppe/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { VitePWA } from "file:///D:/WorkPlace/node/hrms_frsppe/frontend/node_modules/vite-plugin-pwa/dist/index.js";
import frappeui from "file:///D:/WorkPlace/node/hrms_frsppe/frontend/node_modules/frappe-ui/vite.js";
import path from "path";
import fs from "fs";
var __vite_injected_original_dirname = "D:\\WorkPlace\\node\\hrms_frsppe\\frontend";
var vite_config_default = defineConfig({
  server: {
    port: 8080,
    proxy: getProxyOptions(),
    allowedHosts: true
  },
  plugins: [
    vue(),
    frappeui(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      injectRegister: null,
      devOptions: {
        enabled: true
      },
      manifest: {
        display: "standalone",
        name: "Frappe HR",
        short_name: "Frappe HR",
        start_url: "/hrms",
        description: "Everyday HR & Payroll operations at your fingertips",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/assets/hrms/manifest/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/assets/hrms/manifest/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/assets/hrms/manifest/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/assets/hrms/manifest/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    outDir: "../hrms/public/frontend",
    emptyOutDir: true,
    target: "es2015",
    commonjsOptions: {
      include: [/tailwind.config.js/, /node_modules/]
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "frappe-ui": ["frappe-ui"]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      "frappe-ui > feather-icons",
      "showdown",
      "tailwind.config.js",
      "engine.io-client"
    ]
  }
});
function getProxyOptions() {
  const config = getCommonSiteConfig();
  const webserver_port = config ? config.webserver_port : null;
  const proxyOptions = {
    // Node.js backend REST API
    "^/api": {
      target: "http://127.0.0.1:5000",
      changeOrigin: true
    }
  };
  if (webserver_port) {
    proxyOptions["^/(app|assets|files|private)"] = {
      target: `http://127.0.0.1:${webserver_port}`,
      ws: true,
      router: function(req) {
        const site_name = req.headers.host.split(":")[0];
        return `http://${site_name}:${webserver_port}`;
      }
    };
  }
  return proxyOptions;
}
function getCommonSiteConfig() {
  let currentDir = path.resolve(".");
  const rootDir = path.parse(currentDir).root;
  while (currentDir !== rootDir) {
    if (fs.existsSync(path.join(currentDir, "sites")) && fs.existsSync(path.join(currentDir, "apps"))) {
      let configPath = path.join(currentDir, "sites", "common_site_config.json");
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath));
      }
      return null;
    }
    currentDir = path.resolve(currentDir, "..");
  }
  return null;
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrUGxhY2VcXFxcbm9kZVxcXFxocm1zX2Zyc3BwZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV29ya1BsYWNlXFxcXG5vZGVcXFxcaHJtc19mcnNwcGVcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1dvcmtQbGFjZS9ub2RlL2hybXNfZnJzcHBlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIlxyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiXHJcbmltcG9ydCBmcmFwcGV1aSBmcm9tIFwiZnJhcHBlLXVpL3ZpdGVcIlxyXG5cclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxyXG5pbXBvcnQgZnMgZnJvbSBcImZzXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0c2VydmVyOiB7XHJcblx0XHRwb3J0OiA4MDgwLFxyXG5cdFx0cHJveHk6IGdldFByb3h5T3B0aW9ucygpLFxyXG5cdFx0YWxsb3dlZEhvc3RzOiB0cnVlLFxyXG5cdH0sXHJcblx0cGx1Z2luczogW1xyXG5cdFx0dnVlKCksXHJcblx0XHRmcmFwcGV1aSgpLFxyXG5cdFx0Vml0ZVBXQSh7XHJcblx0XHRcdHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcblx0XHRcdHN0cmF0ZWdpZXM6IFwiaW5qZWN0TWFuaWZlc3RcIixcclxuXHRcdFx0aW5qZWN0UmVnaXN0ZXI6IG51bGwsXHJcblx0XHRcdGRldk9wdGlvbnM6IHtcclxuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYW5pZmVzdDoge1xyXG5cdFx0XHRcdGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG5cdFx0XHRcdG5hbWU6IFwiRnJhcHBlIEhSXCIsXHJcblx0XHRcdFx0c2hvcnRfbmFtZTogXCJGcmFwcGUgSFJcIixcclxuXHRcdFx0XHRzdGFydF91cmw6IFwiL2hybXNcIixcclxuXHRcdFx0XHRkZXNjcmlwdGlvbjogXCJFdmVyeWRheSBIUiAmIFBheXJvbGwgb3BlcmF0aW9ucyBhdCB5b3VyIGZpbmdlcnRpcHNcIixcclxuXHRcdFx0XHR0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXHJcblx0XHRcdFx0aWNvbnM6IFtcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c3JjOiBcIi9hc3NldHMvaHJtcy9tYW5pZmVzdC9tYW5pZmVzdC1pY29uLTE5Mi5tYXNrYWJsZS5wbmdcIixcclxuXHRcdFx0XHRcdFx0c2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG5cdFx0XHRcdFx0XHRwdXJwb3NlOiBcImFueVwiLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c3JjOiBcIi9hc3NldHMvaHJtcy9tYW5pZmVzdC9tYW5pZmVzdC1pY29uLTE5Mi5tYXNrYWJsZS5wbmdcIixcclxuXHRcdFx0XHRcdFx0c2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG5cdFx0XHRcdFx0XHRwdXJwb3NlOiBcIm1hc2thYmxlXCIsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzcmM6IFwiL2Fzc2V0cy9ocm1zL21hbmlmZXN0L21hbmlmZXN0LWljb24tNTEyLm1hc2thYmxlLnBuZ1wiLFxyXG5cdFx0XHRcdFx0XHRzaXplczogXCI1MTJ4NTEyXCIsXHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcblx0XHRcdFx0XHRcdHB1cnBvc2U6IFwiYW55XCIsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzcmM6IFwiL2Fzc2V0cy9ocm1zL21hbmlmZXN0L21hbmlmZXN0LWljb24tNTEyLm1hc2thYmxlLnBuZ1wiLFxyXG5cdFx0XHRcdFx0XHRzaXplczogXCI1MTJ4NTEyXCIsXHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcblx0XHRcdFx0XHRcdHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0fSxcclxuXHRcdH0pLFxyXG5cdF0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IHtcclxuXHRcdFx0XCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRvdXREaXI6IFwiLi4vaHJtcy9wdWJsaWMvZnJvbnRlbmRcIixcclxuXHRcdGVtcHR5T3V0RGlyOiB0cnVlLFxyXG5cdFx0dGFyZ2V0OiBcImVzMjAxNVwiLFxyXG5cdFx0Y29tbW9uanNPcHRpb25zOiB7XHJcblx0XHRcdGluY2x1ZGU6IFsvdGFpbHdpbmQuY29uZmlnLmpzLywgL25vZGVfbW9kdWxlcy9dLFxyXG5cdFx0fSxcclxuXHRcdHNvdXJjZW1hcDogdHJ1ZSxcclxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcclxuXHRcdFx0b3V0cHV0OiB7XHJcblx0XHRcdFx0bWFudWFsQ2h1bmtzOiB7XHJcblx0XHRcdFx0XHRcImZyYXBwZS11aVwiOiBbXCJmcmFwcGUtdWlcIl0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRvcHRpbWl6ZURlcHM6IHtcclxuXHRcdGluY2x1ZGU6IFtcclxuXHRcdFx0XCJmcmFwcGUtdWkgPiBmZWF0aGVyLWljb25zXCIsXHJcblx0XHRcdFwic2hvd2Rvd25cIixcclxuXHRcdFx0XCJ0YWlsd2luZC5jb25maWcuanNcIixcclxuXHRcdFx0XCJlbmdpbmUuaW8tY2xpZW50XCIsXHJcblx0XHRdLFxyXG5cdH0sXHJcbn0pXHJcblxyXG5mdW5jdGlvbiBnZXRQcm94eU9wdGlvbnMoKSB7XHJcblx0Y29uc3QgY29uZmlnID0gZ2V0Q29tbW9uU2l0ZUNvbmZpZygpXHJcblx0Y29uc3Qgd2Vic2VydmVyX3BvcnQgPSBjb25maWcgPyBjb25maWcud2Vic2VydmVyX3BvcnQgOiBudWxsXHJcblxyXG5cdGNvbnN0IHByb3h5T3B0aW9ucyA9IHtcclxuXHRcdC8vIE5vZGUuanMgYmFja2VuZCBSRVNUIEFQSVxyXG5cdFx0XCJeL2FwaVwiOiB7XHJcblx0XHRcdHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjUwMDBcIixcclxuXHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxyXG5cdFx0fSxcclxuXHR9XHJcblxyXG5cdC8vIE9ubHkgcHJveHkgRnJhcHBlIHJvdXRlcyB3aGVuIGEgRnJhcHBlIHNlcnZlciBpcyBhdmFpbGFibGVcclxuXHRpZiAod2Vic2VydmVyX3BvcnQpIHtcclxuXHRcdHByb3h5T3B0aW9uc1tcIl4vKGFwcHxhc3NldHN8ZmlsZXN8cHJpdmF0ZSlcIl0gPSB7XHJcblx0XHRcdHRhcmdldDogYGh0dHA6Ly8xMjcuMC4wLjE6JHt3ZWJzZXJ2ZXJfcG9ydH1gLFxyXG5cdFx0XHR3czogdHJ1ZSxcclxuXHRcdFx0cm91dGVyOiBmdW5jdGlvbiAocmVxKSB7XHJcblx0XHRcdFx0Y29uc3Qgc2l0ZV9uYW1lID0gcmVxLmhlYWRlcnMuaG9zdC5zcGxpdChcIjpcIilbMF1cclxuXHRcdFx0XHRyZXR1cm4gYGh0dHA6Ly8ke3NpdGVfbmFtZX06JHt3ZWJzZXJ2ZXJfcG9ydH1gXHJcblx0XHRcdH0sXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcHJveHlPcHRpb25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbW1vblNpdGVDb25maWcoKSB7XHJcblx0bGV0IGN1cnJlbnREaXIgPSBwYXRoLnJlc29sdmUoXCIuXCIpXHJcblx0Y29uc3Qgcm9vdERpciA9IHBhdGgucGFyc2UoY3VycmVudERpcikucm9vdFxyXG5cdC8vIHRyYXZlcnNlIHVwIHRpbGwgd2UgZmluZCBmcmFwcGUtYmVuY2ggd2l0aCBzaXRlcyBkaXJlY3RvcnlcclxuXHR3aGlsZSAoY3VycmVudERpciAhPT0gcm9vdERpcikge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHRmcy5leGlzdHNTeW5jKHBhdGguam9pbihjdXJyZW50RGlyLCBcInNpdGVzXCIpKSAmJlxyXG5cdFx0XHRmcy5leGlzdHNTeW5jKHBhdGguam9pbihjdXJyZW50RGlyLCBcImFwcHNcIikpXHJcblx0XHQpIHtcclxuXHRcdFx0bGV0IGNvbmZpZ1BhdGggPSBwYXRoLmpvaW4oY3VycmVudERpciwgXCJzaXRlc1wiLCBcImNvbW1vbl9zaXRlX2NvbmZpZy5qc29uXCIpXHJcblx0XHRcdGlmIChmcy5leGlzdHNTeW5jKGNvbmZpZ1BhdGgpKSB7XHJcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNvbmZpZ1BhdGgpKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHR9XHJcblx0XHRjdXJyZW50RGlyID0gcGF0aC5yZXNvbHZlKGN1cnJlbnREaXIsIFwiLi5cIilcclxuXHR9XHJcblx0cmV0dXJuIG51bGxcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThTLFNBQVMsb0JBQW9CO0FBQzNVLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxjQUFjO0FBRXJCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFOZixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPLGdCQUFnQjtBQUFBLElBQ3ZCLGNBQWM7QUFBQSxFQUNmO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsTUFDUCxjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsTUFDWixnQkFBZ0I7QUFBQSxNQUNoQixZQUFZO0FBQUEsUUFDWCxTQUFTO0FBQUEsTUFDVjtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1QsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osV0FBVztBQUFBLFFBQ1gsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ047QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNWO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDbkM7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixpQkFBaUI7QUFBQSxNQUNoQixTQUFTLENBQUMsc0JBQXNCLGNBQWM7QUFBQSxJQUMvQztBQUFBLElBQ0EsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ1AsY0FBYztBQUFBLFVBQ2IsYUFBYSxDQUFDLFdBQVc7QUFBQSxRQUMxQjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ2IsU0FBUztBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7QUFFRCxTQUFTLGtCQUFrQjtBQUMxQixRQUFNLFNBQVMsb0JBQW9CO0FBQ25DLFFBQU0saUJBQWlCLFNBQVMsT0FBTyxpQkFBaUI7QUFFeEQsUUFBTSxlQUFlO0FBQUE7QUFBQSxJQUVwQixTQUFTO0FBQUEsTUFDUixRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsSUFDZjtBQUFBLEVBQ0Q7QUFHQSxNQUFJLGdCQUFnQjtBQUNuQixpQkFBYSw4QkFBOEIsSUFBSTtBQUFBLE1BQzlDLFFBQVEsb0JBQW9CLGNBQWM7QUFBQSxNQUMxQyxJQUFJO0FBQUEsTUFDSixRQUFRLFNBQVUsS0FBSztBQUN0QixjQUFNLFlBQVksSUFBSSxRQUFRLEtBQUssTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUMvQyxlQUFPLFVBQVUsU0FBUyxJQUFJLGNBQWM7QUFBQSxNQUM3QztBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBRUEsU0FBTztBQUNSO0FBRUEsU0FBUyxzQkFBc0I7QUFDOUIsTUFBSSxhQUFhLEtBQUssUUFBUSxHQUFHO0FBQ2pDLFFBQU0sVUFBVSxLQUFLLE1BQU0sVUFBVSxFQUFFO0FBRXZDLFNBQU8sZUFBZSxTQUFTO0FBQzlCLFFBQ0MsR0FBRyxXQUFXLEtBQUssS0FBSyxZQUFZLE9BQU8sQ0FBQyxLQUM1QyxHQUFHLFdBQVcsS0FBSyxLQUFLLFlBQVksTUFBTSxDQUFDLEdBQzFDO0FBQ0QsVUFBSSxhQUFhLEtBQUssS0FBSyxZQUFZLFNBQVMseUJBQXlCO0FBQ3pFLFVBQUksR0FBRyxXQUFXLFVBQVUsR0FBRztBQUM5QixlQUFPLEtBQUssTUFBTSxHQUFHLGFBQWEsVUFBVSxDQUFDO0FBQUEsTUFDOUM7QUFDQSxhQUFPO0FBQUEsSUFDUjtBQUNBLGlCQUFhLEtBQUssUUFBUSxZQUFZLElBQUk7QUFBQSxFQUMzQztBQUNBLFNBQU87QUFDUjsiLAogICJuYW1lcyI6IFtdCn0K
