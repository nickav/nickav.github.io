
u64 test(u32 count) {
    f64_Array result = {};
    result.count = count;
    result.data = (f64 *)wasm__push(sizeof(f64) * count);
    return *(u64 *)&result;
}

/*

        push_f64_array2: (length) => {
            const packed = instance.exports.test(length);
            const upper = Number(packed >> BigInt(32));
            const lower = Number(packed & BigInt(0xffffffff));

            const count = lower;
            const at = upper;

            const result = new Float64Array(memory.buffer, at, count);
            return result;
        },

*/