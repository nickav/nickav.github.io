typedef signed int i32;

__attribute__((export_name("add")))
i32 add(i32 x, i32 y) {
    return x + y;
}
