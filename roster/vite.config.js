import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		port: 8081,
		proxy: getProxyOptions(),
		allowedHosts: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	build: {
		outDir: `../hrms/public/roster`,
		emptyOutDir: true,
		target: "es2015",
		commonjsOptions: {
			include: [/tailwind.config.js/, /node_modules/],
		},
	},
	optimizeDeps: {
		include: [
			"frappe-ui > feather-icons",
			"showdown",
			"tailwind.config.js",
			"engine.io-client",
		],
	},
});

function getProxyOptions() {
	const config = getCommonSiteConfig();
	const webserver_port = config ? config.webserver_port : null;

	const proxyOptions = {
		// Node.js backend REST API
		"^/api": {
			target: "http://127.0.0.1:5000",
			changeOrigin: true,
		},
	};

	// Only proxy Frappe routes when a Frappe server is available
	if (webserver_port) {
		proxyOptions["^/(app|assets|files|private)"] = {
			target: `http://127.0.0.1:${webserver_port}`,
			ws: true,
			router: function (req) {
				const site_name = req.headers.host.split(":")[0];
				return `http://${site_name}:${webserver_port}`;
			},
		};
	}

	return proxyOptions;
}

function getCommonSiteConfig() {
	let currentDir = path.resolve(".");
	const rootDir = path.parse(currentDir).root;
	// traverse up till we find frappe-bench with sites directory
	while (currentDir !== rootDir) {
		if (
			fs.existsSync(path.join(currentDir, "sites")) &&
			fs.existsSync(path.join(currentDir, "apps"))
		) {
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
