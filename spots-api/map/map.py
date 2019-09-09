import os
import os.path

from django.core.files import File
from django.conf import settings

class Map:

    spots = []

    def __init__(self, spots):
        self.spots = spots

    # Generate an XML file that can be imported into Google Maps
    def generate_xml(self):
        
        xml_str = "<markers>"

        for spot in self.spots:
            xml_str = xml_str + spot.getXml()

        xml_str = xml_str + "</markers>"

        with open(os.path.join(settings.MEDIA_ROOT, 'shared/map_info/current_map.xml'), 'w') as f:
            current_map = File(f)
            f.write(xml_str)
        current_map.closed
        f.closed