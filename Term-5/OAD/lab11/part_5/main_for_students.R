library(neuralnet)

# 1. creating the initial data

mydata <- data.frame(
  input1 = c(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
  input2 = c(0, 1, 3, 5, 6, 8, 4, 2, 10, 7, 9),
  output = c(0, 2, 5, 8, 10, 13, 10, 9, 18, 16, 19)
)

attach(mydata)
names(mydata)


attach(mydata)
names(mydata)

# Train the model based on output from input

model <- neuralnet(formula = output~input1+input2, 
                   data = mydata, hidden = 10, 
                   threshold = 0.01)

print(model)

# Lets plot and see layers
plot(model)

# Check the data - actual and predicted

final_output = cbind(input1, input2, output, as.data.frame(model$net.result))
colnames(final_output) = c("input1", "input2", "expected output", "neural net output")

print(final_output)
