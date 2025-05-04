"use client";

import { useState } from 'react';
import ServiceCard from '@/components/public/ServiceCard';
import { CATALOG_DATA } from '@/lib/constants';

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState('spaces');
  
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-burgundy-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Nuestro Catálogo</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explora nuestra variedad de espacios, paquetes y servicios personalizados para crear el evento de tus sueños.
          </p>
        </div>
      </section>
      
      {/* Catalog Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex border rounded-lg overflow-hidden">
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'spaces' ? 'bg-burgundy-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('spaces')}
              >
                Espacios
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'packages' ? 'bg-burgundy-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('packages')}
              >
                Paquetes
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'services' ? 'bg-burgundy-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('services')}
              >
                Servicios
              </button>
            </div>
          </div>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'spaces' && CATALOG_DATA.spaces.map(space => (
              <ServiceCard
                key={space.id}
                title={space.title}
                description={space.description}
                capacity={space.capacity}
                image={space.image}
                type="space"
                href={`/spaces/${space.id}`}
              />
            ))}
            
            {activeTab === 'packages' && CATALOG_DATA.packages.map(pkg => (
              <ServiceCard
                key={pkg.id}
                title={pkg.title}
                description={pkg.description}
                image={pkg.image}
                type="package"
                href={`/packages/${pkg.id}`}
              />
            ))}
            
            {activeTab === 'services' && CATALOG_DATA.services.map(service => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                image={service.image}
                type="service"
                href={`/services/${service.id}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 