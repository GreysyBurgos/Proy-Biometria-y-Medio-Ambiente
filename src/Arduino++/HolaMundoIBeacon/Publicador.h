// -*- mode: c++ -*-

// --------------------------------------------------------------
// Jordi Bataller i Mascarell
// --------------------------------------------------------------

#ifndef PUBLICADOR_H_INCLUIDO
#define PUBLICADOR_H_INCLUIDO

// --------------------------------------------------------------
// --------------------------------------------------------------
class Publicador {

  // ............................................................
  // ............................................................
private:
	//UUID fijo de 16 bytes, identifica el proyecto 
  uint8_t beaconUUID[16] = { 
	'U', 'U', 'I', 'D', '-', 'G', 'T', 'I', 
	'-', 'G', 'R', 'E', 'Y', '-', '3', 'A'
	};

  // ............................................................
  // ............................................................
public:
  EmisoraBLE laEmisora {
	"GTI-GREY-25", //  nombre emisora
	  0x004c, // fabricanteID (Apple)
	  4 // txPower
	  };
  
  const int RSSI = -53; // por poner algo, de momento no lo , seria el valor de referencia de señal

  // ............................................................
  // ............................................................
public:

  // ............................................................
  // ............................................................
	//sirve para codificar que tipo de dato estas enviando y se insertan en los byte major del iBeacon
  enum MedicionesID  {
	CO2 = 11,
	TEMPERATURA = 12,
	RUIDO = 13
  };

  // ............................................................
  // ............................................................
  Publicador( ) {
	// ATENCION: no hacerlo aquí. (*this).laEmisora.encenderEmisora();
	// Pondremos un método para llamarlo desde el setup() más tarde
	//no enciende nada solo crea el objeto
  } // ()

  // ............................................................
  // ............................................................
  void encenderEmisora() {
	(*this).laEmisora.encenderEmisora();
  } // ()

  // ............................................................
  // ............................................................
 void publicarCO2(int16_t valorCO2, uint8_t contador, long tiempoEspera) {
    // 1️⃣ Reiniciar todo antes de emitir
    laEmisora.detenerAnuncio();
    Bluefruit.Advertising.clearData();
    Bluefruit.ScanResponse.clearData();

    // 2️⃣ Calcular valores y emitir
    uint16_t major = (MedicionesID::CO2 << 8) + contador;
    laEmisora.emitirAnuncioIBeacon(beaconUUID, major, valorCO2, RSSI);

    // 3️⃣ Esperar
    esperar(tiempoEspera);

    // 4️⃣ Detener anuncio
    laEmisora.detenerAnuncio();
}


  // ............................................................
  // ............................................................
	//es la misma logica que con co2, pero usa MedicionesID::TEMPERATURA, codifica el tipo de dato en el major y el minor guarda la temperatura
  void publicarTemperatura( int16_t valorTemperatura,
							uint8_t contador, long tiempoEspera ) {

	uint16_t major = (MedicionesID::TEMPERATURA << 8) + contador;
	(*this).laEmisora.emitirAnuncioIBeacon( (*this).beaconUUID, 
											major,
											valorTemperatura, // minor
											(*this).RSSI // rssi
									);
	esperar( tiempoEspera );

	(*this).laEmisora.detenerAnuncio();
  } // ()
	
}; // class

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
#endif
