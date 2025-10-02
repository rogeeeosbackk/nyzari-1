import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Gem } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-luxury">Story</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          NyraZari began just two years ago with a sparkle of excitement and a love for all
          things cute and charming.We wanted to bring accessories that make everyday outfits
          feel magical—tiny treasures that lift your mood and show off your personality.From
          delicate earrings to  charms, every piece is carefully picked to spread joy
          and celebrate you.What started as a small re-selling shop has become a happy little
          world of sparkle seekers who believe that great style doesn’t have to be complicated.
          At NyraZari, we’re not just selling jewelry—we’re sharing smiles, one adorable 
          accessory at a time.
          </p>
        </motion.div>

        {/* Heritage Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Text Content */}
  <div className="space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold">
      A Legacy of <span className="text-luxury">Excellence</span>
    </h2>
    <p className="text-muted-foreground leading-relaxed">
      Though NyraZari is a young name, our passion for exquisite jewelry and unwavering
      commitment to quality have quickly set us apart. Every piece we offer is carefully 
      selected from trusted artisans and renowned suppliers, ensuring our customers
      enjoy the same brilliance and craftsmanship that define generations of fine jewelry.
    </p>
    <p className="text-muted-foreground leading-relaxed">
      Each piece in our collection tells a story—of love, celebration, achievement, 
      and the moments that matter most. We believe jewelry should be more than 
      beautiful; it should be meaningful, lasting, and worthy of being passed down 
      through generations.
    </p>
  </div>

  {/* Image */}
  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
    <img
      src="/assets/nyrazari-favicon.png"     // replace with your image path
      alt="Heritage"
      className="w-full h-full object-cover rounded-lg"
    />
  </div>
</div>

        </motion.section>

        {/* Values Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-luxury">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every piece we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Gem,
                title: 'Exceptional Quality',
                description: 'We source only the finest materials and every accessory—though cute and crafted or selected with care. We partner with trusted suppliers and carefully inspect each piece so you can enjoy lasting shine, perfect finishes, and comfortable wear. craftsmen.'
              },
              {
                icon: Heart,
                title: 'Affordability with Style',
                description: 'Every piece is created with love and attention to Cute, trendy, and accessible jewelry for everyone without compromising on quality., ensuring it meets our exacting standards of beauty and durability.'
              },
              {
                icon: Users,
                title: 'Personal Service',
                description: 'We believe in building lasting relationships with our clients, offering personalized service and custom design consultations.'
              },
              {
                icon: Award,
                title: 'Trust & Transparency',
                description: 'Our designs transcend trends, creating pieces that remaiHonest sourcHonest sourcing and clear product information—no hidden surprises.ing and clear product information—no hidden surprises.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="card-luxury text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <value.icon className="h-12 w-12 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Craftsmanship Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center order-2 lg:order-1">
          <img
          src="/assets/nyrazari-favicon.png"      // Path to your image
          alt="Craftsmanship"
          className="w-full h-full object-cover rounded-lg" />
          </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                What we <span className="text-luxury">Bring to You</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At NyraZari, we bring you cute, accessories that add sparkle to everyday life.
                 Every piece is carefully selected for quality, charm, and comfort, letting you express
                  your style with joy and confidence. Tiny treasures, big smiles—that’s what 
                  we promise with every accessory and jewls.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">Cute Accessories – Fun, charming pieces to brighten everyday outfits.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">Exceptional Quality – Carefully selected or crafted for lasting shine and comfort.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">Joyful Style – Accessories that let you express your personality and bring smiles.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">Affordable Elegance – Trendy, delightful pieces that won’t break the bank.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-luxury">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind every exquisite piece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
             {
                name: '',
                role: '',
                description: ''
                
              },
              {
                name: 'Anupama Nipin',
                role: 'Founder',
                description: 'started NyraZari two years ago with a love for cute,accessories and a passion for helping people express their style.'
              },
              {
                name: '',
                role: '',
                description: ''
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="card-luxury text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;