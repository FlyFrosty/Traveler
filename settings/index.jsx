function mySettings(props) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");

  return (
    <Page>
      <Section>
        <ImagePicker
          title="Background Image"
          description="Pick an image to use as your background."
          label="Touch here to pick a background image"
          sublabel="Background image picker"
          settingsKey="background-image"
          imageWidth={ screenWidth }
          imageHeight={ screenHeight }
        />
    </Section>
    <Section>
      <Text>Touch a circle to select a font color</Text>
      <ColorSelect
        centered={true}
        settingsKey="color"
        colors={[
          {color: "black"},
          {color: "darkgray"},
          {color: "lightgray"},
          {color: "white"},
          {color: "wheat"},
          {color: "darkseagreen"},
          {color: "forestgreen"},          
          {color: "blue"},
          {color: "deepskyblue"},
          {color: "cadetblue"},
          {color: "cyan"},
          {color: "red"},
          {color: "darkred"},
          {color: "magenta"},
          {color: "plum"},
          {color: "purple"},
          {color: "brown"},
          {color: "maroon"}
        ]}
        onSelection={(value) => console.log(value)}
      />
    </Section>
    <Section>
      <Toggle
        settingsKey="whatTime"
        label="24 Hour Clock (gray) 12 Hour (green)"
      />
    </Section>
    <Section>
      <Select
        label={`Select an offset from GMT (Zulu)`}
        settingsKey="offsetTime"
        options={[
          {name:"Zulu - 12", value: "-12.0"},
          {name:"Zulu - 11", value: "-11.0"},
          {name:"Zulu - 10+30", value: "-10.5"},
          {name:"Zulu - 10", value: "-10.0"},
          {name:"Zulu - 9", value: "-09.0"},
          {name:"Zulu - 8", value: "-08.0"},           
          {name:"Zulu - 7", value: "-07.0"},
          {name:"Zulu - 6", value: "-06.0"},  
          {name:"Zulu - 5", value: "-05.0"},
          {name:"Zulu - 4", value: "-04.0"},
          {name:"Zulu - 3", value: "-03.0"},
          {name:"Zulu - 2", value: "-02.0"},
          {name:"Zulu - 1", value: "-01.0"},
          {name:"GMT", value: "+25.0"},
          {name:"Zulu + 1", value: "+01.0"},
          {name:"Zulu + 2", value: "+02.0"},           
          {name:"Zulu + 3", value: "+03.0"},
          {name:"Zulu + 3:30", value: "+3.5"},
          {name:"Zulu + 4", value: "+04.0"},
          {name:"Zulu + 4:30", value: "+04.5"},
          {name:"Zulu + 5", value: "+05.0"},
          {name:"Zulu + 5:30", value: "+05.5"},
          {name:"Zulu + 6", value: "+06.0"},
          {name:"Zulu + 7", value: "+07.0"},
          {name:"Zulu + 8", value: "+08.0"},
          {name:"Zulu + 9", value: "+09.0"},
          {name:"Zulu + 9:30", value: "+09.5"},
          {name:"Zulu + 10", value: "+10.0"},
          {name:"Zulu + 11", value: "+11.0"},
          {name:"Zulu + 12", value: "+12.0"},
          {name:"Zulu + 13", value: "+13.0"}
        ]}
      />
    </Section>
    <Section>
      <Toggle
        settingsKey="batDisp"
        label="Display Battery Icon?"
      />
      </Section>
    <Section>
      <Toggle
        settingsKey="timeOrFit"
        label="Second Time (gray) or Fitness (green)"
      />
      </Section>

    </Page>
  );
}

registerSettingsPage(mySettings);