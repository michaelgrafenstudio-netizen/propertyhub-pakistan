import 'package:flutter/material';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'dart:math';

// ==========================================
// 1. DART MODELS
// ==========================================
class Property {
  final String id;
  final String title;
  final String description;
  final double price;
  final String city;
  final String area;
  final String type; // HOUSE, APARTMENT, PLOT
  final String purpose; // SALE, RENT
  final double areaSize;
  final String areaUnit;
  final int bedrooms;
  final int bathrooms;
  final bool isVerified;
  final String imageUrl;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.city,
    required this.area,
    required this.type,
    required this.purpose,
    required this.areaSize,
    required this.areaUnit,
    required this.bedrooms,
    required this.bathrooms,
    required this.isVerified,
    required this.imageUrl,
  });
}

class ChatMessage {
  final String id;
  final String senderId;
  final String senderName;
  final String content;
  final DateTime timestamp;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.content,
    required this.timestamp,
  });
}

// ==========================================
// 2. STATE PROVIDERS (RIVERPOD)
// ==========================================
final languageProvider = StateProvider<String>((ref) => 'en'); // 'en' or 'ur'
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.dark);

// Search Query filters state
class PropertyFilter {
  final String city;
  final String type;
  final String purpose;
  final double minPrice;
  final double maxPrice;

  PropertyFilter({
    this.city = '',
    this.type = '',
    this.purpose = '',
    this.minPrice = 0.0,
    this.maxPrice = 100000000.0,
  });

  PropertyFilter copyWith({
    String? city,
    String? type,
    String? purpose,
    double? minPrice,
    double? maxPrice,
  }) {
    return PropertyFilter(
      city: city ?? this.city,
      type: type ?? this.type,
      purpose: purpose ?? this.purpose,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
    );
  }
}

final propertyFilterProvider = StateProvider<PropertyFilter>((ref) => PropertyFilter());

// Sample Properties Data
final propertiesListProvider = StateProvider<List<Property>>((ref) {
  return [
    Property(
      id: 'p1',
      title: '5 Marla Luxury House in DHA Phase 6',
      description: 'Newly constructed double-story luxury house in Block K, DHA Lahore. Near main boulevard.',
      price: 18500000.0,
      city: 'Lahore',
      area: 'DHA Phase 6',
      type: 'HOUSE',
      purpose: 'SALE',
      areaSize: 5.0,
      areaUnit: 'MARLA',
      bedrooms: 3,
      bathrooms: 4,
      isVerified: true,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400',
    ),
    Property(
      id: 'p2',
      title: '2 Bed Modern Apartment in Centaurus Heights',
      description: 'Fully furnished scenic apartment with amenities in Islamabad. Centrally air conditioned.',
      price: 125000.0,
      city: 'Islamabad',
      area: 'F-8',
      type: 'APARTMENT',
      purpose: 'RENT',
      areaSize: 8.5,
      areaUnit: 'MARLA',
      bedrooms: 2,
      bathrooms: 2,
      isVerified: true,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    ),
    Property(
      id: 'p3',
      title: '1 Kanal Residential Plot in Bahria Town',
      description: 'Ideal level residential plot ready for immediate construction in Sector C.',
      price: 32000000.0,
      city: 'Karachi',
      area: 'Bahria Town',
      type: 'PLOT',
      purpose: 'SALE',
      areaSize: 1.0,
      areaUnit: 'KANAL',
      bedrooms: 0,
      bathrooms: 0,
      isVerified: false,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    ),
  ];
});

// Chats State Provider
final chatsListProvider = StateProvider<Map<String, List<ChatMessage>>>((ref) {
  return {
    'p1': [
      ChatMessage(
        id: 'm1',
        senderId: 'seller',
        senderName: 'Ali Khan',
        content: 'Hi, is this DHA Phase 6 house still available?',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      ChatMessage(
        id: 'm2',
        senderId: 'buyer',
        senderName: 'You',
        content: 'Yes, it is available! Let me know if you would like to schedule a visit.',
        timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
      ),
    ],
    'p2': [
      ChatMessage(
        id: 'm3',
        senderId: 'seller',
        senderName: 'Zainab Malik',
        content: 'Hello, what is the monthly maintenance cost for the Centaurus apartment?',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ]
  };
});

// ==========================================
// 3. MAIN APPLICATION & NAVIGATION
// ==========================================
void main() {
  runApp(const ProviderScope(child: PropertyHubApp()));
}

class PropertyHubApp extends ConsumerWidget {
  const PropertyHubApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    final GoRouter router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const MainNavigationShell(),
        ),
        GoRoute(
          path: '/property/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return PropertyDetailPage(propertyId: id);
          },
        ),
        GoRoute(
          path: '/chat/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ChatRoomPage(propertyId: id);
          },
        ),
      ],
    );

    return MaterialApp.router(
      title: 'PropertyHub Pakistan',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF6366F1),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFF38BDF8),
          surface: Colors.white,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF6366F1),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF0F172A),
        ),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}

// ==========================================
// 4. MAIN NAVIGATION SHELL (TAB HANDLER)
// ==========================================
class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const PropertiesExploreScreen(),
    const MapViewerScreen(),
    const ValuationAIScreen(),
    const ChatsInboxScreen(),
    const UserProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.explore), label: 'Explore'),
          NavigationDestination(icon: Icon(Icons.map), label: 'Map'),
          NavigationDestination(icon: Icon(Icons.analytics), label: 'AI Valuation'),
          NavigationDestination(icon: Icon(Icons.chat), label: 'Chats'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

// ==========================================
// 5. TRANSLATIONS HELPER
// ==========================================
String t(String key, String lang) {
  final Map<String, Map<String, String>> localized = {
    'en': {
      'app_title': 'PropertyHub Pakistan',
      'search_hint': 'Search DHA, Bahria, apartments...',
      'properties': 'Featured Listings',
      'city': 'City',
      'price': 'Price',
      'verification_badge': 'Verified Listing',
      'language_toggle': 'اردو',
      'bed': 'Beds',
      'bath': 'Baths',
      'val_title': 'AI Valuation Estimator',
      'val_subtitle': 'Calculate market pricing instantly using ML',
      'estimate': 'Calculate Valuation',
      'chat_title': 'Conversations',
      'profile_title': 'Profile Manager',
    },
    'ur': {
      'app_title': 'پراپرٹی ہب پاکستان',
      'search_hint': 'ڈی ایچ اے، بحریہ یا فلیٹ تلاش کریں...',
      'properties': 'نمایاں پراپرٹیز',
      'city': 'شہر',
      'price': 'قیمت',
      'verification_badge': 'تصدیق شدہ پراپرٹی',
      'language_toggle': 'English',
      'bed': 'بیڈز',
      'bath': 'باتھ',
      'val_title': 'مصنوعی ذہانت ویلیوایشن تخمینہ',
      'val_subtitle': 'مارکیٹ ریٹس کا فوری اور درست تخمینہ حاصل کریں',
      'estimate': 'تخمینہ لگائیں',
      'chat_title': 'گفتگو',
      'profile_title': 'پروفائل مینیجر',
    }
  };

  return localized[lang]?[key] ?? key;
}

// ==========================================
// 6. SCREEN 1: EXPLORE PROPERTIES
// ==========================================
class PropertiesExploreScreen extends ConsumerWidget {
  const PropertiesExploreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);
    final properties = ref.watch(propertiesListProvider);
    final isUrdu = lang == 'ur';

    return Directionality(
      textDirection: isUrdu ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            t('app_title', lang),
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          actions: [
            TextButton(
              onPressed: () {
                ref.read(languageProvider.notifier).state = lang == 'en' ? 'ur' : 'en';
              },
              child: Text(
                t('language_toggle', lang),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            IconButton(
              icon: Icon(ref.watch(themeModeProvider) == ThemeMode.dark ? Icons.light_mode : Icons.dark_mode),
              onPressed: () {
                ref.read(themeModeProvider.notifier).state =
                    ref.read(themeModeProvider) == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
              },
            ),
          ],
        ),
        body: Column(
          children: [
            // Search Input Row
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                decoration: InputDecoration(
                  hintText: t('search_hint', lang),
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  filled: true,
                ),
              ),
            ),

            // Properties Grid
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                itemCount: properties.length,
                itemBuilder: (context, index) {
                  final p = properties[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: InkWell(
                      onTap: () => context.push('/property/${p.id}'),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Stack(
                            children: [
                              Image.network(
                                p.imageUrl,
                                height: 180,
                                width: double.infinity,
                                fit: coverHeightAndWidth(),
                                errorBuilder: (c, e, s) => Container(
                                  height: 180,
                                  color: Colors.grey[800],
                                  child: const Icon(Icons.image_not_supported, size: 50),
                                ),
                              ),
                              if (p.isVerified)
                                Positioned(
                                  top: 12,
                                  left: isUrdu ? null : 12,
                                  right: isUrdu ? 12 : null,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, py: 5),
                                    decoration: BoxDecoration(
                                      color: Colors.emerald,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.verified, size: 14, color: Colors.white),
                                        const SizedBox(width: 4),
                                        Text(
                                          t('verification_badge', lang),
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.between,
                                  children: [
                                    Text(
                                      '${p.price.toStringAsFixed(0)} PKR',
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Theme.of(context).primaryColor,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, py: 4),
                                      decoration: BoxDecoration(
                                        color: p.purpose == 'SALE' ? Colors.blue/10 : Colors.green/10,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        p.purpose,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: p.purpose == 'SALE' ? Colors.blue : Colors.green,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  p.title,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${p.area}, ${p.city}',
                                  style: TextStyle(color: Colors.grey[500], fontSize: 13),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Icon(Icons.king_bed, size: 18, color: Colors.grey[500]),
                                    const SizedBox(width: 4),
                                    Text('${p.bedrooms} ${t('bed', lang)}'),
                                    const SizedBox(width: 16),
                                    Icon(Icons.bathtub, size: 18, color: Colors.grey[500]),
                                    const SizedBox(width: 4),
                                    Text('${p.bathrooms} ${t('bath', lang)}'),
                                    const SizedBox(width: 16),
                                    Icon(Icons.photo_size_select_small, size: 18, color: Colors.grey[500]),
                                    const SizedBox(width: 4),
                                    Text('${p.areaSize} ${p.areaUnit}'),
                                  ],
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  coverHeightAndWidth() => BoxFit.cover;
}

// ==========================================
// 7. SCREEN 2: INTERACTIVE PROPERTY MAP
// ==========================================
class MapViewerScreen extends ConsumerWidget {
  const MapViewerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);
    final properties = ref.watch(propertiesListProvider);
    final isUrdu = lang == 'ur';

    return Directionality(
      textDirection: isUrdu ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        appBar: AppBar(title: const Text('Property Map Finder')),
        body: Stack(
          children: [
            // Mock map layout representation
            Container(
              color: Colors.blueGrey[900],
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map, size: 80, color: Colors.blueGrey[700]),
                    const SizedBox(height: 16),
                    const Text(
                      'Google Maps Pakistan view',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Latitude: 31.4705, Longitude: 74.4533',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
            ),

            // Pins Overlay Mock list
            Positioned(
              top: 120,
              left: 80,
              child: GestureDetector(
                onTap: () => context.push('/property/p1'),
                child: const MapPinWidget(price: '1.85 Crore', label: 'DHA LHR'),
              ),
            ),
            Positioned(
              top: 240,
              right: 90,
              child: GestureDetector(
                onTap: () => context.push('/property/p2'),
                child: const MapPinWidget(price: '125K RENT', label: 'Centaurus ISB'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MapPinWidget extends StatelessWidget {
  final String price;
  final String label;

  const MapPinWidget({super.key, required this.price, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, py: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF6366F1),
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(price, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
          Text(label, style: const TextStyle(fontSize: 9, color: Colors.white70)),
        ],
      ),
    );
  }
}

// ==========================================
// 8. SCREEN 3: AI PROPERTY VALUATION TOOL
// ==========================================
class ValuationAIScreen extends StatefulWidget {
  const ValuationAIScreen({super.key});

  @override
  State<ValuationAIScreen> createState() => _ValuationAIScreenState();
}

class _ValuationAIScreenState extends State<ValuationAIScreen> {
  final _cityController = TextEditingController(text: 'Lahore');
  final _areaSizeController = TextEditingController(text: '5');
  String _propertyType = 'HOUSE';
  String _valuationResult = '';
  bool _isLoading = false;

  void _runAIValuation() {
    setState(() {
      _isLoading = true;
    });

    // Simulate ML Model Calculation latency
    Future.delayed(const Duration(seconds: 1), () {
      final size = double.tryParse(_areaSizeController.text) ?? 5.0;
      double basePrice = 1200000;
      if (_cityController.text.toLowerCase().contains('islamabad')) {
        basePrice = 2200000;
      } else if (_cityController.text.toLowerCase().contains('lahore')) {
        basePrice = 1800000;
      }

      double est = basePrice * size;
      if (_propertyType == 'COMMERCIAL') est *= 1.8;

      setState(() {
        _isLoading = false;
        _valuationResult = '${(est / 10000000).toStringAsFixed(2)} Crore PKR';
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Property Valuation')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.analytics, size: 50, color: Color(0xFF6366F1)),
            const SizedBox(height: 16),
            const Text(
              'Real Estate AI Valuation',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Estimate average property prices in Pakistan using AI models.',
              style: TextStyle(color: Colors.grey[500]),
            ),
            const SizedBox(height: 24),

            TextField(
              controller: _cityController,
              decoration: const InputDecoration(
                labelText: 'City',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _areaSizeController,
              decoration: const InputDecoration(
                labelText: 'Area Size (Marlas)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _propertyType,
              decoration: const InputDecoration(
                labelText: 'Property Type',
                border: OutlineInputBorder(),
              ),
              items: const [
                DropdownMenuItem(value: 'HOUSE', child: Text('House')),
                DropdownMenuItem(value: 'APARTMENT', child: Text('Apartment')),
                DropdownMenuItem(value: 'PLOT', child: Text('Plot')),
                DropdownMenuItem(value: 'COMMERCIAL', child: Text('Commercial')),
              ],
              onChanged: (val) {
                setState(() {
                  _propertyType = val!;
                });
              },
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _isLoading ? null : _runAIValuation,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Calculate Valuation'),
              ),
            ),

            if (_valuationResult.isNotEmpty) ...[
              const SizedBox(height: 32),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Text('Estimated Market Value', style: TextStyle(fontSize: 14, color: Colors.grey)),
                    const SizedBox(height: 8),
                    Text(
                      _valuationResult,
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.green),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Model Confidence: 89.2% (Medium-High)',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              )
            ]
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 9. SCREEN 4: CHATS INBOX SCREEN
// ==========================================
class ChatsInboxScreen extends ConsumerWidget {
  const ChatsInboxScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);
    final properties = ref.watch(propertiesListProvider);
    final chats = ref.watch(chatsListProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(t('chat_title', lang)),
      ),
      body: ListView.builder(
        itemCount: chats.keys.length,
        itemBuilder: (context, index) {
          final propId = chats.keys.elementAt(index);
          final messages = chats[propId]!;
          final lastMsg = messages.last;

          final property = properties.firstWhere((p) => p.id == propId,
              orElse: () => Property(
                    id: 'unknown',
                    title: 'Property Chat',
                    description: '',
                    price: 0,
                    city: '',
                    area: '',
                    type: '',
                    purpose: '',
                    areaSize: 0,
                    areaUnit: '',
                    bedrooms: 0,
                    bathrooms: 0,
                    isVerified: false,
                    imageUrl: '',
                  ));

          return ListTile(
            leading: CircleAvatar(
              backgroundImage: property.imageUrl.isNotEmpty ? NetworkImage(property.imageUrl) : null,
              child: property.imageUrl.isEmpty ? const Icon(Icons.home) : null,
            ),
            title: Text(property.title, maxLines: 1, overflow: TextOverflow.ellipsis),
            subtitle: Text(lastMsg.content, maxLines: 1, overflow: TextOverflow.ellipsis),
            trailing: Text(
              '${lastMsg.timestamp.hour}:${lastMsg.timestamp.minute.toString().padLeft(2, '0')}',
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
            onTap: () => context.push('/chat/$propId'),
          );
        },
      ),
    );
  }
}

// ==========================================
// 10. SCREEN 5: USER PROFILE & SETTINGS
// ==========================================
class UserProfileScreen extends ConsumerWidget {
  const UserProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);

    return Scaffold(
      appBar: AppBar(title: Text(t('profile_title', lang))),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          const Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Color(0xFF6366F1),
                  child: Text('U', style: TextStyle(fontSize: 40, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
                SizedBox(height: 12),
                Text('Muhammad Ali (Agent)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text('+92 312 9876543', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
          const SizedBox(height: 32),
          const Divider(),

          ListTile(
            leading: const Icon(Icons.add_home_work),
            title: const Text('Add New Property'),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Launch Add Listing Wizard')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.verified_user),
            title: const Text('Verify Account (CNIC)'),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Verification documents screen')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.payment),
            title: const Text('Featured Subscriptions'),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Easypaisa & JazzCash billing portal')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 11. DETAIL PAGE & SUB-ROUTING
// ==========================================
class PropertyDetailPage extends ConsumerWidget {
  final String propertyId;

  const PropertyDetailPage({super.key, required this.propertyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final properties = ref.read(propertiesListProvider);
    final p = properties.firstWhere((item) => item.id == propertyId);

    return Scaffold(
      appBar: AppBar(title: Text(p.city)),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(p.imageUrl, height: 250, width: double.infinity, fit: BoxFit.cover),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        '${p.price.toStringAsFixed(0)} PKR',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.green),
                      ),
                      if (p.isVerified)
                        const Chip(
                          label: Text('Verified Owner', style: TextStyle(color: Colors.white, fontSize: 11)),
                          backgroundColor: Colors.emerald,
                        ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(p.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('${p.area}, ${p.city}', style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 10),
                  const Text('Property Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Bedrooms: ${p.bedrooms}'),
                      Text('Bathrooms: ${p.bathrooms}'),
                      Text('Size: ${p.areaSize} ${p.areaUnit}'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 10),
                  const Text('Description', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(p.description, style: const TextStyle(color: Colors.grey, height: 1.5)),
                  const SizedBox(height: 40),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => context.push('/chat/${p.id}'),
                          icon: const Icon(Icons.chat),
                          label: const Text('In-app Chat'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.phone),
                          label: const Text('Call Seller'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6366F1),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 12. LIVE CHAT ROOM PAGE
// ==========================================
class ChatRoomPage extends ConsumerStatefulWidget {
  final String propertyId;

  const ChatRoomPage({super.key, required this.propertyId});

  @override
  ConsumerState<ChatRoomPage> createState() => _ChatRoomPageState();
}

class _ChatRoomPageState extends ConsumerState<ChatRoomPage> {
  final _msgController = TextEditingController();

  void _sendMsg() {
    if (_msgController.text.trim().isEmpty) return;

    final newMsg = ChatMessage(
      id: 'm-' + Random().nextInt(100000).toString(),
      senderId: 'buyer',
      senderName: 'You',
      content: _msgController.text.trim(),
      timestamp: DateTime.now(),
    );

    // Update state using ref
    final currentChats = {...ref.read(chatsListProvider)};
    if (currentChats.containsKey(widget.propertyId)) {
      currentChats[widget.propertyId] = [...currentChats[widget.propertyId]!, newMsg];
    } else {
      currentChats[widget.propertyId] = [newMsg];
    }

    ref.read(chatsListProvider.notifier).state = currentChats;
    _msgController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final chats = ref.watch(chatsListProvider);
    final messages = chats[widget.propertyId] ?? [];

    return Scaffold(
      appBar: AppBar(title: const Text('Live Broker Chat')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final m = messages[index];
                final isMe = m.senderId == 'buyer';

                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, py: 10),
                    decoration: BoxDecoration(
                      color: isMe ? const Color(0xFF6366F1) : Colors.grey[800],
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(m.content, style: const TextStyle(color: Colors.white)),
                        const SizedBox(height: 4),
                        Text(
                          '${m.timestamp.hour}:${m.timestamp.minute.toString().padLeft(2, '0')}',
                          style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.6)),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgController,
                    decoration: const InputDecoration(
                      hintText: 'Type message...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: Color(0xFF6366F1)),
                  onPressed: _sendMsg,
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
