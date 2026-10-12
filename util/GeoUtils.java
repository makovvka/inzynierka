package com.example.inzynierka.util;

import java.util.HashMap;
import java.util.Map;

public class GeoUtils {

    private static final Map<String, double[]> CITY_COORDS = new HashMap<>();

    static {

        CITY_COORDS.put("Warszawa", new double[]{52.2297, 21.0122});
        CITY_COORDS.put("Kraków", new double[]{50.0647, 19.9450});
        CITY_COORDS.put("Łódź", new double[]{51.7592, 19.4550});
        CITY_COORDS.put("Wrocław", new double[]{51.1079, 17.0385});
        CITY_COORDS.put("Poznań", new double[]{52.4064, 16.9252});
        CITY_COORDS.put("Gdansk", new double[]{54.3520, 18.6466});
        CITY_COORDS.put("Szczecin", new double[]{53.4289, 14.5530});
        CITY_COORDS.put("Bydgoszcz", new double[]{53.1235, 18.0084});
        CITY_COORDS.put("Lublin", new double[]{51.2465, 22.5684});
        CITY_COORDS.put("Białystok", new double[]{53.1325, 23.1688});
        CITY_COORDS.put("Katowice", new double[]{50.2709, 19.0399});
        CITY_COORDS.put("Rzeszów", new double[]{50.0413, 21.9990});
        CITY_COORDS.put("Olsztyn", new double[]{53.7784, 20.4801});
        CITY_COORDS.put("Opole", new double[]{50.6751, 17.9213});
        CITY_COORDS.put("Gorzów wielkopolski", new double[]{52.7368, 15.2288});
        CITY_COORDS.put("Zielona góra", new double[]{51.9356, 15.5064});
        CITY_COORDS.put("Kielce", new double[]{50.8661, 20.6286});
        CITY_COORDS.put("Toruń", new double[]{53.0138, 18.5984});
        CITY_COORDS.put("Radom", new double[]{51.4027, 21.1471});
        CITY_COORDS.put("Gliwice", new double[]{50.2945, 18.6714});
        CITY_COORDS.put("Zabrze", new double[]{50.3249, 18.7857});
        CITY_COORDS.put("Sosnowiec", new double[]{50.2863, 19.1041});
        CITY_COORDS.put("Częstochowa", new double[]{50.8118, 19.1203});
        CITY_COORDS.put("Tarnów", new double[]{50.0124, 20.9887});
        CITY_COORDS.put("Bielsko-biała", new double[]{49.8225, 19.0584});
        CITY_COORDS.put("Kalisz", new double[]{51.7611, 18.0910});
        CITY_COORDS.put("Koszalin", new double[]{54.1943, 16.1710});
        CITY_COORDS.put("Płock", new double[]{52.5463, 19.7065});
        CITY_COORDS.put("Legnica", new double[]{51.2070, 16.1553});
        CITY_COORDS.put("Grudziądz", new double[]{53.4837, 18.7536});
    }


    public static double[] getCityCoordinates(String city) {
        if (city == null) return null;
        return CITY_COORDS.get(city.toLowerCase());
    }


    public static double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }


    public static Map<String, double[]> getAllCities() {
        return CITY_COORDS;
    }
}
