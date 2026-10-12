package com.example.inzynierka.controller;

import com.example.inzynierka.dto.CarResponse;
import com.example.inzynierka.dto.UserResponse;
import com.example.inzynierka.exception.NotFoundException;
import com.example.inzynierka.model.Car;
import com.example.inzynierka.model.Role;
import com.example.inzynierka.model.User;
import com.example.inzynierka.repository.CarRepository;
import com.example.inzynierka.repository.UserRepository;
import com.example.inzynierka.spec.CarSpecifications;
import com.example.inzynierka.util.GeoUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarController(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    private CarResponse mapToResponse(Car car) {
        User owner = car.getOwner();
        UserResponse ownerDto = new UserResponse(
                owner.getId(),
                owner.getUsername(),
                owner.getEmail(),
                owner.getRole()
        );

        return new CarResponse(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getPrice(),
                car.getMileage(),
                car.getDescription(),
                car.getCity(),
                car.getLatitude(),
                car.getLongitude(),
                car.getImages(),
                ownerDto
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> getMyCars(Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Brak autoryzacji");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<CarResponse> cars = carRepository.findAll()
                .stream()
                .filter(c -> c.getOwner() != null && c.getOwner().getId().equals(user.getId()))
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(cars);
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getCities() {
        return ResponseEntity.ok(GeoUtils.getAllCities().keySet());
    }

    @GetMapping
    public ResponseEntity<?> getAllCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minMileage,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String nearCity,
            @RequestParam(required = false) Double radiusKm,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Specification<Car> spec = Specification
                .where(CarSpecifications.hasBrand(brand))
                .and(CarSpecifications.hasModel(model))
                .and(CarSpecifications.yearFrom(minYear))
                .and(CarSpecifications.yearTo(maxYear))
                .and(CarSpecifications.priceFrom(minPrice))
                .and(CarSpecifications.priceTo(maxPrice))
                .and(CarSpecifications.mileageFrom(minMileage))
                .and(CarSpecifications.mileageTo(maxMileage))
                .and(CarSpecifications.descriptionContains(q))
                .and(CarSpecifications.hasCity(city));

        Page<Car> cars = carRepository.findAll(spec, pageable);

        // Filtrowanie po promieniu
        if (nearCity != null && radiusKm != null) {
            double[] coords = GeoUtils.getCityCoordinates(nearCity);
            if (coords == null) {
                return ResponseEntity.badRequest().body("Unknown city: " + nearCity);
            }

            double lat = coords[0];
            double lon = coords[1];

            List<CarResponse> result = cars.stream()
                    .filter(c -> c.getLatitude() != null && c.getLongitude() != null)
                    .filter(c -> GeoUtils.distanceKm(lat, lon, c.getLatitude(), c.getLongitude()) <= radiusKm)
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);
        }

        return ResponseEntity.ok(cars.map(this::mapToResponse));
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<CarResponse> getOne(@PathVariable Long id) {

        Car car = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        return ResponseEntity.ok(mapToResponse(car));
    }


    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> addCar(
            @RequestPart("car") String carJson,
            @RequestPart("files") List<MultipartFile> files
    ) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User owner = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            ObjectMapper mapper = new ObjectMapper();
            Car car = mapper.readValue(carJson, Car.class);
            car.setOwner(owner);

            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            for (MultipartFile file : files) {
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = Paths.get(uploadDir).resolve(filename).normalize();
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                car.getImages().add(filename);
            }

            Car saved = carRepository.save(car);

            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving car");
        }
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long id,
            @RequestPart("files") List<MultipartFile> files
    ) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        String uploadDir = "uploads/";

        try {
            Files.createDirectories(Paths.get(uploadDir));

            for (MultipartFile file : files) {
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = Paths.get(uploadDir).resolve(filename);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                car.getImages().add(filename);
            }

            carRepository.save(car);
            return ResponseEntity.ok(mapToResponse(car));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload error");
        }
    }

    @DeleteMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> deleteImage(
            @PathVariable Long id,
            @RequestBody DeleteImageRequest req
    ) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        if (!car.getImages().contains(req.filename))
            return ResponseEntity.badRequest().body("Image not found");

        car.getImages().remove(req.filename);
        carRepository.save(car);

        try {
            Files.deleteIfExists(Paths.get("uploads").resolve(req.filename));
        } catch (Exception ignored) {}

        return ResponseEntity.ok(mapToResponse(car));
    }

    public static class DeleteImageRequest {
        public String filename;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody Car body
    ) {

        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!user.getRole().equals(Role.ADMIN) &&
                !existing.getOwner().getUsername().equals(user.getUsername()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your car");

        existing.setBrand(body.getBrand());
        existing.setModel(body.getModel());
        existing.setYear(body.getYear());
        existing.setPrice(body.getPrice());
        existing.setMileage(body.getMileage());
        existing.setDescription(body.getDescription());
        existing.setCity(body.getCity());
        existing.setLatitude(body.getLatitude());
        existing.setLongitude(body.getLongitude());

        carRepository.save(existing);
        return ResponseEntity.ok(mapToResponse(existing));
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get("uploads").resolve(filename).normalize();
            if (!Files.exists(path)) return ResponseEntity.notFound().build();

            Resource resource = new UrlResource(path.toUri());

            String contentType = Files.probeContentType(path);
            if (contentType == null) contentType = "image/jpeg";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {

        Car car = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // właściciel lub admin
        if (!user.getRole().equals(Role.ADMIN) &&
                !car.getOwner().getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not your car");
        }

        for (String img : car.getImages()) {
            try {
                Files.deleteIfExists(Paths.get("uploads").resolve(img));
            } catch (Exception ignored) {}
        }

        carRepository.delete(car);

        return ResponseEntity.ok("Car deleted");
    }

    @GetMapping("/favorites")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> getFavoriteCars(Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<CarResponse> favorites = user.getFavorites()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(favorites);
    }


    @PostMapping("/favorites/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> addFavorite(@PathVariable Long id, Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Car car = carRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Car not found"));

        if (car.getOwner() != null && car.getOwner().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Nie możesz dodać własnego ogłoszenia do ulubionych");
        }

        boolean alreadyFav = user.getFavorites()
                .stream()
                .anyMatch(c -> c.getId().equals(id));

        if (!alreadyFav) {
            user.getFavorites().add(car);   // ⬅️ DODAJEMY CAR, NIE Long
            userRepository.save(user);
        }

        return ResponseEntity.ok("Added");
    }


    @DeleteMapping("/favorites/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> removeFavorite(@PathVariable Long id, Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.getFavorites().removeIf(c -> c.getId().equals(id));
        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }


}
