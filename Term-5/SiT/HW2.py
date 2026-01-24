from itertools import combinations

n = 7
k = 4
g = 0b1011          # порождающий полином (x^3 + x + 1)
message = 0b1101    # информационный вектор (x^3 + x^2 + 1)

#Деление полинома dividend на полином divisor, возврат остатка от деления
def poly_div(dividend, divisor):
    while dividend.bit_length() >= divisor.bit_length():
        shift = dividend.bit_length() - divisor.bit_length()
        dividend ^= divisor << shift
    return dividend

#Кодирование сообщения m 
def encode(m):
    shifted = m << (n - k)
    remainder = poly_div(shifted, g)
    return shifted | remainder

#Вычисление синдрома ошибки
def syndrome(v):
    return poly_div(v, g)

#Построение таблицы синдромов
def build_syndrome_table():
    table = {}
    for pos in range(n):
        e = 1 << pos
        s = syndrome(e)
        table[s] = e
    return table

syn_table = build_syndrome_table()

codeword = encode(message)

rows = []

#Вычисление обнаруживающей и корректирующей способностей кода
for i in range(1, n + 1):
    error_vectors = list(combinations(range(n), i))
    Ci = len(error_vectors)
    No = 0
    Nk = 0

    for positions in error_vectors:
        e = 0
        for p in positions:
            e |= (1 << p)

        r = codeword ^ e
        s = syndrome(r)

        if s != 0:
            No += 1

        if s in syn_table:
            r_fixed = r ^ syn_table[s]
            if r_fixed == codeword:
                Nk += 1

    Co = No / Ci * 100
    Ck = Nk / Ci * 100

    rows.append((i, Ci, No, Nk, Co, Ck))

print("i\tCᵢ\tNₒ\tNₖ\tCₒ (%)\tCₖ (%)")
for row in rows:
    i, Ci, No, Nk, Co, Ck = row
    print(f"{i}\t{Ci}\t{No}\t{Nk}\t{Co:.1f}%\t{Ck:.1f}%")
