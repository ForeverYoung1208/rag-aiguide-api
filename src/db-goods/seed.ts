export const seed = String.raw`

-- public.item definition

-- Drop tables

DROP TABLE IF EXISTS public.items_groups;
DROP TABLE IF EXISTS public.item;
DROP TABLE IF EXISTS public."group";


--
CREATE SEQUENCE IF NOT EXISTS public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.newtable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 

CREATE TABLE public.item (
	id int8 DEFAULT nextval('newtable_id_seq'::regclass) NOT NULL,
	"name" varchar NOT NULL,
	code varchar NOT NULL,
	price int8 NOT NULL,
	description text NULL,
	brand varchar NULL,
	CONSTRAINT item_pk PRIMARY KEY (id),
	CONSTRAINT item_unique UNIQUE (code)
);


INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (1,'GloboPhone X1','GPX1-256GB',69900,'5G smartphone, 8 GB RAM, 256 GB storage, 6.5″ OLED screen, 4500 mAh battery.','GloboTech'),
	 (2,'GloboPhone X1 Pro','GPX1P-512GB',89900,'5G smartphone, 12 GB RAM, 512 GB storage, 6.7″ curved display, 4800 mAh battery.','GloboTech'),
	 (3,'GloboPhone Lite','GPL-128GB',39900,'Budget 5G phone, 6 GB RAM, 128 GB storage, 6.1″ LCD screen, 4000 mAh battery.','GloboTech'),
	 (4,'NovaPhone 5G Mini','NPM-64GB',34900,'Compact 5G phone, 4 GB RAM, 64 GB storage, 5.8″ screen, 4200 mAh battery.','NovaCom'),
	 (5,'NovaPhone 5G','NP5G-128GB',54900,'Mid-range 5G phone, 8 GB RAM, 128 GB storage, 6.4″ AMOLED, 5000 mAh battery.','NovaCom'),
	 (6,'NovaPhone Ultra','NPU-256GB',109900,'High-end 5G phone, 16 GB RAM, 256 GB storage, 6.9″ AMOLED, 5500 mAh battery.','NovaCom'),
	 (7,'SpectraPhone S20','SPS20-128GB',79900,'5G, 8 GB RAM, 128 GB, 6.7″ curved OLED, 5000 mAh battery.','Spectra'),
	 (8,'SpectraPhone S20 Pro','SPS20P-256GB',99900,'5G flagship, 12 GB RAM, 256 GB, 6.8″ display, 5200 mAh battery.','Spectra'),
	 (9,'EcoPhone E1','EPE1-64GB',29900,'Eco-friendly 5G phone, 6 GB RAM, 64 GB, 6.1″ LCD, 4500 mAh battery, recycled materials.','EcoTech'),
	 (10,'EcoPhone E1 Plus','EPE1P-128GB',39900,'Eco 5G phone, 8 GB RAM, 128 GB, 6.4″ screen, 5000 mAh battery.','EcoTech');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (11,'TurboPhone T9','TPT9-256GB',64900,'5G speed phone, 10 GB RAM, 256 GB, 6.5″ AMOLED, 6000 mAh battery, fast charging.','TurboCorp'),
	 (12,'TurboPhone T9 Lite','TPT9L-128GB',44900,'Lightweight 5G phone, 6 GB RAM, 128 GB, 6.2″ screen, 5000 mAh battery.','TurboCorp'),
	 (61,'GloboPhone X2','GPX2-256GB',79900,'New-gen 5G, 12 GB RAM, 256 GB, 6.8″ OLED, 5000 mAh battery.','GloboTech'),
	 (62,'GloboPhone X2 Lite','GPX2L-128GB',49900,'Slim 5G phone, 8 GB RAM, 128 GB, 6.2″ screen, 4800 mAh battery.','GloboTech'),
	 (63,'NovaPhone 5G Max','NPMAX-512GB',129900,'High capacity 5G phone, 16 GB RAM, 512 GB, 6.9″ AMOLED, 5600 mAh battery.','NovaCom'),
	 (64,'SpectraPhone S21','SPS21-128GB',84900,'Next-gen SpectraPhone, 8 GB RAM, 128 GB, 6.7″ curved OLED, 5100 mAh battery.','Spectra'),
	 (65,'SpectraPhone S21 Pro','SPS21P-256GB',104900,'Pro model, 12 GB RAM, 256 GB, 6.8″ quad-camera, 5200 mAh battery.','Spectra'),
	 (66,'EcoPhone E2','EPE2-128GB',44900,'Eco 5G, 8 GB RAM, 128 GB, 6.5″ screen, 5100 mAh battery, made of sustainable materials.','EcoTech'),
	 (67,'TurboPhone T10','TPT10-256GB',72900,'Fast 5G, 12 GB RAM, 256 GB, 6.6″ AMOLED, 6200 mAh battery.','TurboCorp'),
	 (68,'TurboPhone T10 Pro','TPT10P-512GB',99900,'Premium 5G phone, 16 GB RAM, 512 GB, 6.9″ OLED, 6500 mAh battery.','TurboCorp');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (13,'RetroTalk 200','RT200-BTN',9900,'Classic button phone, 512 KB RAM, simple mono display, 1200 mAh battery, physical keypad.','RetroTech'),
	 (14,'RetroTalk 300','RT300-BTN',11900,'Vintage button phone, small color screen, 1 MB memory, 1400 mAh battery.','RetroTech'),
	 (15,'BrickPhone 100','BP100-OLD',7500,'Robust “brick” phone, physical keypad, small monochrome screen, 1000 mAh battery.','Oldie'),
	 (16,'FlipTalk F1','FTF1-FLP',13900,'Flip phone with external 1.8″ screen, 2 MB memory, 900 mAh battery.','FlipCo'),
	 (17,'FlipTalk F2','FTF2-FLP',15900,'Improved flip, 2.4″ internal screen, 3 MB memory, 1000 mAh battery.','FlipCo'),
	 (18,'ClassicDial CD1','CD1-KEY',10900,'Candybar-style, physical dial pad, 1.5″ screen, 1 MB memory, 1100 mAh battery.','ClassicTech'),
	 (19,'ClassicDial CD2','CD2-PLUS',12900,'Same as CD1 but with a color display and 1.8″ screen, 1500 mAh battery.','ClassicTech'),
	 (20,'VintageCall V10','VCV10-VTG',8900,'Rugged vintage phone, 512 KB memory, 1.2″ screen, 1200 mAh battery.','VintageCorp'),
	 (21,'VintageCall V20','VCV20-VTG',14900,'Vintage-style phone, 1.8″ screen, 1 MB storage for contacts, 1300 mAh battery.','VintageCorp'),
	 (69,'RetroTalk 400','RT400-BTN',12900,'Button phone, color 2″ screen, 2 MB memory, 1400 mAh battery.','RetroTech');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (70,'FlipTalk F3','FTF3-FLP',17900,'Stylish flip phone, 2.8″ screen, external mini display, 1200 mAh battery.','FlipCo'),
	 (71,'ClassicDial CD3','CD3-PLUS',14900,'Candybar phone, 1.8″ color screen, 1.5 MB memory, 1500 mAh battery.','ClassicTech'),
	 (22,'KeyPro Standard Keyboard','KPK-S',4500,'Full-size membrane keyboard, no-rgb, durable build.','Logitech'),
	 (23,'KeyPro Mechanical Keyboard','KPK-M',12900,'Mechanical keyboard with 104 keys, Cherry MX Blue switches, 16 MB onboard memory.','Corsair'),
	 (24,'KeyPro Slim Keyboard','KPK-SLIM',5500,'Slim profile keyboard, low key travel, quiet typing.','Dell'),
	 (25,'KeyPro Gaming Keyboard','KPK-G',14900,'RGB gaming keyboard, Cherry MX Red switches, anti-ghosting, media keys.','Razer'),
	 (26,'ErgoKey Keyboard','EK-ERGO',11900,'Ergonomic split keyboard, mechanical switches, wrist support.','Keychron'),
	 (27,'CompactKey 60%','CK60',8900,'Compact 60%-layout, mechanical keyboard, hot-swappable switches.','Keychron'),
	 (28,'HeavyDuty Industrial Keyboard','HDIK-USB',15900,'Industrial-grade keyboard, spill-resistant, USB connection.','Das Keyboard'),
	 (29,'SilenceKey Membrane','SKM',4990,'Quiet membrane keyboard ideal for office environments.','Logitech');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (30,'WiredKey Basic USB','WKUSB-B',3800,'Basic wired USB keyboard, plug-and-play, standard layout.','Microsoft'),
	 (31,'WiredKey Mechanical USB','WKUSB-MX',9900,'Mechanical wired keyboard with MX Black switches, USB connector.','Corsair'),
	 (32,'WiredKey Retro PS/2','WKPS2-RT',7200,'Classic PS/2 wired keyboard, clicky feel, durable keys.','IBM'),
	 (33,'WiredKey Ergonomic','WKUSB-ERG',11500,'Curved ergonomic wired keyboard, standard-size keys.','Microsoft'),
	 (34,'WiredKey Backlight USB','WKUSB-BL',8500,'Wired keyboard with adjustable backlit keys.','Razer'),
	 (35,'WiredKey Gaming Pro','WKUSB-GPRO',13900,'Gaming wired keyboard, anti-ghosting, macro support.','Logitech'),
	 (36,'WirelessKey Bluetooth Compact','WKBT-C',12900,'Bluetooth compact keyboard, rechargeable battery, 3-device pairing.','Keychron'),
	 (37,'WirelessKey Radio Full-size','WKRF',13900,'2.4 GHz wireless full-size keyboard, dongle included.','Logitech'),
	 (38,'WirelessKey Bluetooth Ergo','WKBT-ERGO',15900,'Wireless ergonomic split keyboard over Bluetooth.','Keychron'),
	 (39,'WirelessKey Rechargeable','WKBT-RC',14900,'Bluetooth keyboard with built-in rechargeable battery and USB-C charging.','Corsair');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (40,'WirelessKey Slim Radio','WKRF-SLIM',11900,'Slim wireless keyboard using 2.4 GHz dongle.','Logitech'),
	 (41,'ViewMax 24″ Full HD','VM24-FHD',79900,'24″ IPS monitor, 1080p resolution, 75 Hz refresh, 5 ms response.','HP'),
	 (42,'ViewMax 27″ 4K','VM27-4K',159900,'27″ monitor, 3840×2160 resolution, IPS panel, 60 Hz.','Dell'),
	 (43,'ViewMax Curved 32″','VM32-C',199900,'32″ curved VA-panel monitor, 144 Hz refresh, 2560×1440 resolution.','Acer'),
	 (44,'SpeedView Gaming 27″ 240Hz','SVG27-240',229900,'27″ gaming monitor, 240 Hz refresh rate, 1 ms response.','Asus'),
	 (45,'SpeedView Esports 24.5″ 360Hz','SVG24-360',249900,'24.5″ esports monitor, 360 Hz, 1080p.','BenQ'),
	 (46,'EcoMon 22″','EM22',54900,'22″ monitor, energy-efficient, 1080p, built-in low-blue-light mode.','LG'),
	 (47,'ProDesigner 27″ Colour-Accurate','PD27-CA',189900,'27″ monitor with 99% sRGB gamut, color-calibrated, 60 Hz.','Dell'),
	 (48,'PortableView 15.6″ USB-C','PV15-USB',99900,'15.6″ portable monitor, 1080p, powered over USB-C.','ASUS'),
	 (79,'ViewMax 21.5″ Full HD','VM21-FHD',69900,'21.5″ IPS 1080p monitor, compact design.','HP');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (80,'ViewMax 30″ 4K','VM30-4K',239900,'30″ monitor, 4K resolution, IPS panel, 60 Hz.','LG'),
	 (81,'SpeedView Gaming 32″ 144Hz','SVG32-144',209900,'32″ gaming monitor, 144 Hz refresh, 2560×1440.','Acer'),
	 (82,'EcoMon 24″ Low-Power','EM24-LP',89900,'24″ energy-saving monitor, 1080p, eco-mode power.','LG'),
	 (83,'ProDesigner 32″ Colour-Accurate','PD32-CA',249900,'32″ professional monitor, 98% DCI-P3 gamut, 60 Hz.','Dell'),
	 (84,'PortableView 17″ USB-C','PV17-USB',129900,'17″ portable display, USB-C power, 1080p.','ASUS'),
	 (49,'USB-C Charger 65 W','USBC-65W',19900,'65 W USB-C wall charger, supports PD fast charging.','Anker'),
	 (50,'Wireless Charger Pad 10 W','WCPD-10W',12900,'Qi-standard 10 W wireless charging pad.','Belkin'),
	 (51,'Power Bank 20 000mAh','PB20K',14900,'Portable power bank, 20 000 mAh capacity, USB-C output.','Xiaomi'),
	 (52,'Bluetooth Earbuds X2','BE-X2',79900,'TWS earbuds, Bluetooth 5.2, 6 h playtime + 24 h with charging case.','JBL'),
	 (53,'Over-Ear Headphones Pro','HP-PRO',99900,'Over-ear headphones, 40 mm drivers, wired and Bluetooth modes.','Sony');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (54,'Gaming Mouse GM1','GM1-USB',49900,'Gaming mouse with 16000 DPI sensor, programmable buttons.','Logitech'),
	 (55,'Ergo Mouse Bluetooth','EM-BT',35900,'Vertical ergonomic Bluetooth mouse, rechargeable.','Logitech'),
	 (56,'Mechanical Numeric Keypad','MNK-USB',10900,'Standalone mechanical keypad, USB, Cherry-style switches.','Corsair'),
	 (57,'Webcam 1080p','WC-1080',59900,'Full HD 1080p webcam, autofocus, built-in mic.','Logitech'),
	 (58,'Desk Lamp with USB','DL-USB',24900,'LED desk lamp with 3 brightness levels, powered via USB.','Philips'),
	 (59,'USB Hub 4-Port','USBH-4',19900,'4-port USB 3.0 hub, compact design.','Anker'),
	 (60,'Laptop Stand Aluminium','LS-ALU',69900,'Foldable aluminium laptop stand, portable and sturdy.','TwelveSouth'),
	 (85,'Gaming Headset GH-X','GHHX',119900,'Gaming headset, 50 mm drivers, surround-sound simulation.','HyperX'),
	 (86,'Laptop Backpack 15″','LB15',49900,'15″ laptop backpack, padded compartments and water-resistant fabric.','CaseLogic'),
	 (87,'External SSD 1 TB USB-C','ESSD1T-USB',159900,'1 TB external SSD, USB-C interface, up to 1050 MB/s.','Samsung');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (88,'HDMI Cable 2 m','HDMIC-2',2990,'High-speed HDMI 2.0 cable, 2 meters long.','CablePro'),
	 (89,'Surge Protector 4-way','SP4P',39900,'4-socket surge protector, 2 USB-A charging ports.','APC'),
	 (90,'Desk Microphone USB','DM-USB',89900,'USB studio microphone, cardioid pattern, 16-bit/48 kHz.','Blue'),
	 (91,'Wireless Presenter','WPR-2.4G',9990,'Wireless presenter with laser pointer and 2.4 GHz dongle.','Logitech'),
	 (92,'Smartwatch X10','SWX10',159900,'Smartwatch, 1.78″ AMOLED screen, heart-rate monitor, Bluetooth Sync.','Fitbit'),
	 (93,'Smartwatch X10 Pro','SWX10P',209900,'Pro smartwatch, GPS + LTE, 2-day battery life, 1.9″ screen.','Fitbit'),
	 (94,'Fitness Tracker F1','FTF1-1',69900,'Slim fitness tracker, step counter, sleep monitoring, 7-day battery.','Xiaomi'),
	 (95,'VR Headset V2','VRV2',299900,'Standalone VR headset, 4 K (2×2K) display, 6-axis tracking.','Meta'),
	 (96,'USB-A to USB-C Cable 1 m','UAC1',1990,'Durable 1 m USB-A to USB-C cable, braided.','Anker'),
	 (97,'Portable Projector Mini','PPM',249900,'Mini portable projector, 1080p, HDMI / USB-C input.','XGIMI');
INSERT INTO public.item (id,name,code,price,description,brand) VALUES
	 (98,'Smart Light Bulb RGB','SLB-RGB',39900,'Wi-Fi smart bulb, RGB color control, mobile app integration.','Philips'),
	 (99,'Wi-Fi Router AX3000','WR-AX3000',129900,'Dual-band Wi-Fi 6 router, up to 3000 Mbps, 4 antennas.','TP-Link'),
	 (100,'Bluetooth Speaker S1','BTS1',79900,'Portable Bluetooth speaker, 12-hour battery, 20 W RMS output.','JBL');



-- public."group" definition


CREATE TABLE public."group" (
	id int8 DEFAULT nextval('groups_id_seq'::regclass) NOT NULL,
	"name" varchar NOT NULL,
	description text NULL,
	master_group_id int8 NULL,
	CONSTRAINT groups_pk PRIMARY KEY (id),
	CONSTRAINT groups_unique UNIQUE (name)
);


INSERT INTO public."group" (id,"name",description,master_group_id) VALUES
	 (1,'phones','all phones',NULL),
	 (2,'cell phones','cellular phones, smartphones with touch screen',1),
	 (3,'old style phones','old style phones without touchscreen, only buttons',1),
	 (4,'keyboards','keyboards, including wired or wireless',NULL),
	 (6,'wired keyboards','wired keyboards (usb, ps/2, other)',4),
	 (7,'wireless keyboards','wireless keyboards (bluetooth, radio, wifi, etc.)',4),
	 (8,'monitors','monitors',NULL),
	 (9,'other','uncathegorized',NULL);


-- public.items_groups definition

CREATE TABLE public.items_groups (
	item_id int8 NOT NULL,
	group_id int8 NULL
);
CREATE UNIQUE INDEX items_groups_item_id_idx ON public.items_groups USING btree (item_id, group_id);

INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (1,2),
	 (2,2),
	 (3,2),
	 (4,2),
	 (5,2),
	 (6,2),
	 (7,2),
	 (8,2),
	 (9,2),
	 (10,2);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (11,2),
	 (12,2),
	 (61,2),
	 (62,2),
	 (63,2),
	 (64,2),
	 (65,2),
	 (66,2),
	 (67,2),
	 (68,2);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (13,3),
	 (14,3),
	 (15,3),
	 (16,3),
	 (17,3),
	 (18,3),
	 (19,3),
	 (20,3),
	 (21,3),
	 (69,3);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (70,3),
	 (71,3),
	 (22,4),
	 (23,4),
	 (24,4),
	 (25,4),
	 (26,4),
	 (27,4),
	 (28,4),
	 (29,4);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (30,6),
	 (31,6),
	 (32,6),
	 (33,6),
	 (34,6),
	 (35,6),
	 (36,7),
	 (37,7),
	 (38,7),
	 (39,7);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (40,7),
	 (41,8),
	 (42,8),
	 (43,8),
	 (44,8),
	 (45,8),
	 (46,8),
	 (47,8),
	 (48,8),
	 (79,8);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (80,8),
	 (81,8),
	 (82,8),
	 (83,8),
	 (84,8),
	 (49,9),
	 (50,9),
	 (51,9),
	 (52,9),
	 (53,9);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (54,9),
	 (55,9),
	 (56,9),
	 (57,9),
	 (58,9),
	 (59,9),
	 (60,9),
	 (85,9),
	 (86,9),
	 (87,9);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (88,9),
	 (89,9),
	 (90,9),
	 (91,9),
	 (92,9),
	 (93,9),
	 (94,9),
	 (95,9),
	 (96,9),
	 (97,9);
INSERT INTO public.items_groups (item_id,group_id) VALUES
	 (98,9),
	 (99,9),
	 (100,9);

-- public.items_groups foreign keys

ALTER TABLE public.items_groups ADD CONSTRAINT items_groups_group_fk FOREIGN KEY (group_id) REFERENCES public."group"(id);
ALTER TABLE public.items_groups ADD CONSTRAINT items_groups_item_fk FOREIGN KEY (item_id) REFERENCES public.item(id);

`;
