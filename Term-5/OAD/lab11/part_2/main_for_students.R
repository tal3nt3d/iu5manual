
library("ggplot2")

# 2.1 Построение scatter plot
##############################################
# Использовать базовую функцию plot()
View(mtcars)
plot(mtcars$hp, mtcars$cyl)

# Использовать функцию ggplot    
library("ggplot2")             
ggplot(mtcars, aes(x=hp, y=cyl)) + geom_point()
###############################################


# 2.2 Построение a Line Graph
########################################################
# add points and/or multiple lines
plot(pressure$temperature, pressure$pressure, type="l")
points(pressure$temperature, pressure$pressure)
lines(pressure$temperature, pressure$pressure/2, col="red")
points(pressure$temperature, pressure$pressure/2, col="red")

#Using ggplot2 if two vectors are already in the same data frame
ggplot(pressure, aes(x=temperature, y=pressure)) + geom_line() + geom_point()
#####################################################################


#2.3 Creating a Bar Graph
####################################################################
# Using barplot()
barplot(BOD$demand, names.arg=BOD$Time)

# Using ggplot2 If the vector is in a data frame
# Bar graph of values. This uses the BOD data frame, with the
#"Time" column for x values and the "demand" column for y values.
ggplot(BOD, aes(x=Time, y=demand)) + geom_bar(stat="identity")
##################################################################


# 2.4 Creating a Histogram
##################################################################
# Using hist()
hist(mtcars$mpg)
# Specify approximate number of bins with breaks
hist(mtcars$mpg, breaks=10)

ggplot(mtcars, aes(x=mpg)) + geom_histogram(binwidth=4)
##################################################################


# 2.5 Creating a Box Plot
####################################################################
# Using plot()
plot(ToothGrowth$supp, ToothGrowth$len)

# If the two vectors are in the same data frame
# Formula syntax
boxplot(len ~ supp, data = ToothGrowth)
# Put interaction of two variables on x-axis
boxplot(len ~ supp + dose, data = ToothGrowth)

# Boxplot с точками данных
ggplot(ToothGrowth, aes(x = supp, y = len, fill = supp)) + 
  geom_boxplot() +
  facet_grid(. ~ dose) +
  labs(title = "Распределение длины зубов")
####################################################################

