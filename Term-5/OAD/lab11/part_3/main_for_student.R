library(ggplot2)
library(forecast)

x <- AirPassengers
k <- time(x)[length(x)*0.8]

trainx <- window(x, end=k-1)
testx <- window(x, start=k)

fc <- snaive(trainx)
autoplot(fc)

fcfitets <- ets(trainx)
autoplot(fcfitets)

arimats <- auto.arima(trainx, stepwise=FALSE, approximation=FALSE)
fcarimats <- forecast(arimats)
autoplot(fcarimats)


