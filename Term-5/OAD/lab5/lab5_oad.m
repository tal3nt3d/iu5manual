function y = z_low(x, a, b)
    y = zeros(size(x));
    for i = 1:length(x)
        if x(i) <= a
            y(i) = 1;
        elseif x(i) >= b
            y(i) = 0;
        else
            y(i) = (b - x(i)) / (b - a);
        end
    end
end

function y = z_mid(x, a, b, c, d)
    y = zeros(size(x));
    for i = 1:length(x)
        if x(i) <= a || x(i) >= d
            y(i) = 0;
        elseif x(i) >= b && x(i) <= c
            y(i) = 1;
        elseif x(i) > a && x(i) < b
            y(i) = (x(i) - a) / (b - a);
        else
            y(i) = (d - x(i)) / (d - c);
        end
    end
end

function y = z_high(x, a, b)
    y = zeros(size(x));
    for i = 1:length(x)
        if x(i) <= a
            y(i) = 0;
        elseif x(i) >= b
            y(i) = 1;
        else
            y(i) = (x(i) - a) / (b - a);
        end
    end
end

function y = froom(attrib, term)
    if strcmp(term, 'Дешёвый')
        y = z_low(attrib, 2000, 4000);
    elseif strcmp(term, 'Средний')
        y = z_mid(attrib, 3500, 7000, 9000, 11000);
    elseif strcmp(term, 'Дорогой')
        y = z_high(attrib, 9000, 13000);
    else
        y = zeros(size(attrib));
    end
end

function y = fdays(attrib, term)
    if strcmp(term, 'Малый')
        y = z_low(attrib, 2, 4);
    elseif strcmp(term, 'Средний')
        y = z_mid(attrib, 3, 5, 7, 9);
    elseif strcmp(term, 'Длительный')
        y = z_high(attrib, 7, 14);
    else
        y = zeros(size(attrib));
    end
end

function y = fage(attrib, term)
    if strcmp(term, 'Молодой')
        y = z_low(attrib, 24, 30);
    elseif strcmp(term, 'Средний')
        y = z_mid(attrib, 25, 35, 50, 65);
    elseif strcmp(term, 'Пожилой')
        y = z_high(attrib, 60, 75);
    else
        y = zeros(size(attrib));
    end
end

function plot_fuzzy_room()
    x = 0:100:15000;
    
    y_cheap = froom(x, 'Дешёвый');
    y_medium = froom(x, 'Средний');
    y_expensive = froom(x, 'Дорогой');
    
    figure;
    plot(x, y_cheap, 'r-', 'LineWidth', 2);
    hold on;
    plot(x, y_medium, 'g-', 'LineWidth', 2);
    plot(x, y_expensive, 'b-', 'LineWidth', 2);
    hold off;
    
    grid on;
    xlabel('Цена комнаты (руб.)', 'FontSize', 12);
    ylabel('Степень принадлежности', 'FontSize', 12);
    title('Функции принадлежности для цены комнаты', 'FontSize', 14);
    legend('Дешёвый', 'Средний', 'Дорогой', 'Location', 'best');
    xlim([0, 15000]);
    ylim([0, 1.1]);
end

function plot_fuzzy_age()
    x = 0:100;
    
    y_young = fage(x, 'Молодой');
    y_medium = fage(x, 'Средний');
    y_old = fage(x, 'Пожилой');
    
    figure;
    plot(x, y_young, 'r-', 'LineWidth', 2);
    hold on;
    plot(x, y_medium, 'g-', 'LineWidth', 2);
    plot(x, y_old, 'b-', 'LineWidth', 2);
    hold off;
    
    grid on;
    xlabel('Возраст (лет)', 'FontSize', 12);
    ylabel('Степень принадлежности', 'FontSize', 12);
    title('Функции принадлежности для возраста клиента', 'FontSize', 14);
    legend('Молодой', 'Средний', 'Пожилой', 'Location', 'best');
    xlim([0, 100]);
    ylim([0, 1.1]);
end

function plot_fuzzy_days()
    x = 0:30;
    
    y_short = fdays(x, 'Малый');
    y_medium = fdays(x, 'Средний');
    y_long = fdays(x, 'Длительный');
    
    figure;
    plot(x, y_short, 'r-', 'LineWidth', 2);
    hold on;
    plot(x, y_medium, 'g-', 'LineWidth', 2);
    plot(x, y_long, 'b-', 'LineWidth', 2);
    hold off;
    
    grid on;
    xlabel('Длительность пребывания (дн.)', 'FontSize', 12);
    ylabel('Степень принадлежности', 'FontSize', 12);
    title('Функции принадлежности для продолжительности пребывания', 'FontSize', 14);
    legend('Малый', 'Средний', 'Длительный', 'Location', 'best');
    xlim([0, 30]);
    ylim([0, 1.1]);
end

plot_fuzzy_room();
plot_fuzzy_age();
plot_fuzzy_days();
