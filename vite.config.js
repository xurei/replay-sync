import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__CHANGELOG__': fs.readFileSync('./CHANGELOG.md'),
  },
  plugins: [
    react({
      babel: {
        plugins: [
          "babel-plugin-styled-components",
        ],
        parserOpts: {
        }
      }
    }),
    //babel({
    //  babelConfig: {
    //    babelrc: false,
    //    configFile: false,
    //    plugins: [
    //      "react-hot-loader/babel",
    //    ],
    //    presets: [
    //      "@babel/preset-react"
    //    ],
    //  }
    //}),
  ],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    // loader: "tsx",
    // include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: fs.readFileSync(args.path, "utf8"),
            }));
          },
        },
      ],
    },
  },
});
