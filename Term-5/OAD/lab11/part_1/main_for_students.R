# # Выбрать Working directory. Это нужно сделать, что бы в
# # процессе работы каждый раз не прописывать полный путь к файлам,
# # а пользоваться относительными путями
# # укажите путь до папки part_1 включительно
# #setwd("C:/Users/<Имя пользователя>/Documents/ОАД/lab_R/part_1")

# #еще можно так (если вы храните проект в Documents(Windows)):
# setwd("/home/tal3nt3d/oad/lab11/lab_R/part_1")

# #######################################################################

# # 1. Класический вариант загрузки данных (.csv and .txt файлы)

# # Загрузка simpsons_episodes.csv, Population.txt и Cities.xlsx из Working directory
# simpsons <- read.csv("./data/simpsons_episodes.csv", sep = ",")

# View(simpsons)
# #тип объекта
# typeof(simpsons)


# # Вывод первых и последних строк загруженных данных
# head(simpsons)
# tail(simpsons)

# # Просмотр имен столбцов
# names(simpsons)

# # Здесь нужно написать код для загрузки данных
# # используя утилиту read


# # Import excel datasets
# # Using readxl pacakge
# library(readxl)
# Cities <- read_excel("./data/Cities.xlsx")
# View(Cities)

# #######################################################################

# # 2. Загрузка данных из других пакетов R
# # Загрузка набора данных M3 из пакета Mcomp
# library("Mcomp")

# data(M1)

# str(M1)

# #######################################################################

# # 3. Загрузка данных из интернета
# # Для этого воспользуемся пакетом RCurl

# # вызов пакета Rcurl

# # получение данных из интернета
# myfile <- read.csv("./data/mlb_players.csv", sep = ",", header = TRUE)

# # Чтение данных
# View(myfile)

# #######################################################################

# # 4. Получение свойств данных
# # посмотреть начальные строки объекта
# head(myfile)

# # посмотреть последние строки объекта
# tail(myfile)

# # общая информация об объекте
# summary(myfile)

# # внутренняя структура объекта
# str(myfile)

# # размерности объекта
# dim(myfile)

# # имена размерностей объекта
# dimnames(myfile)

# # имена объекта
# names(myfile)

# # число элементов
# length(myfile)

# #######################################################################

# # 5. Работа с Data Frame

# создание нового фрейма данных
name <- c("Nicole Y.", "Jane B.", "Pink T.", "Floyd W.", "Sam S.", "George J.")
weight <- c(60, 68, 71, 87, 67, 93)
height <- c(174, 168, 178, 188, 165, 172)
size <- c("L", "S", "XL", "XXL", "S", "M")
sex <- c("male", "female", "male", "male", "female", "male")
data <- data.frame(name, weight, height, size, sex)

#ЗАДАНИЯ ДЛЯ САМОСТОЯТЕЛЬНОГО ВЫПОЛНЕНИЯ

# 1.отобрать все колонки кроме 1-ой
# пример команды 
data_without_first <- data[, -1]
print("1. Все колонки кроме 1-ой:")
print(data_without_first)

# 2.отобрать column weight
# пример:
weight_column <- data$weight
print("2. Колонка weight:")
print(weight_column)

# 3.Отобрать только данные, относящиеся к женщинам
# пример:
female_data <- data[data$sex == "female", ]
print("3. Данные женщин:")
print(female_data)

# 4.сортировка по весу
# пример: 
sorted_by_weight <- data[order(data$weight), ]
print("4. Данные, отсортированные по весу:")
print(sorted_by_weight)

# 5.отсортировать наши данные сначала по полу, а потом по росту
sorted_by_sex_height <- data[order(data$sex, data$height), ]
print("5. Данные отсортированные по полу и росту:")
print(sorted_by_sex_height)

# 6.Сделайте выборку записей с weight <= 80, используя команду subset,
# и убедитесь, что в ней не осталось записей с weight > 80
# (выведите кол-во записей с weight > 80 (команда length()) )
subset_weight <- subset(data, weight <= 80)
print("6. Выборка с weight <= 80:")
print(subset_weight)
print(max(subset_weight$weight))
print(length(which(data$weight > 80)))
