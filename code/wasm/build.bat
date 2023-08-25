::clang --target=wasm32 -O2 --no-standard-libraries -nostartfiles -mbulk-memory -Wl,--export-all -Wl,--no-entry -Wl,--import-memory -o hello.wasm hello.c

::clang --target=wasm32 -o hello.wasm hello.c
::clang --target=wasm32 --no-standard-libraries -o hello.wasm hello.c

clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o hello.wasm hello.c
