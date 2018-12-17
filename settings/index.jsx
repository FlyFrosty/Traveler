function mySettings(props) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");

  return (
    <Page>
      <Section>
        <ImagePicker
          title="Background Image"
          description="Pick an image to use as your background."
          label="Pick a Background Image"
          sublabel="Background image picker"
          settingsKey="background-image"
          imageWidth={ screenWidth }
          imageHeight={ screenHeight }
        />
    </Section>
    <Section>
      <ColorSelect
        centered={true}
        settingsKey="color"
        colors={[
          {color: "black"},
          {color: "lightgray"},
          {color: "white"},
          {color: "forestgreen"},
          {color: "maroon"},
          {color: "blue"},
          {color: "deepskyblue"},
          {color: "plum"},
          {color: "purple"},
          {color: "cyan"},
          {color: "brown"},
          {color: "magenta"},
          {color: "red"},
          {color: "darkgray"}
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
          {name:"Zulu - 5", value: "-05"},
          {name:"Zulu - 4", value: "-04"},
          {name:"Zulu - 3", value: "-03"},
          {name:"Zulu - 2", value: "-02"},
          {name:"Zulu - 1", value: "-01"},
          {name:"GMT", value: "+25"},
          {name:"Zulu + 1", value: "+01"},
          {name:"Zulu + 2", value: "+02"},           
          {name:"Zulu + 3", value: "+03"},
          {name:"Zulu + 4", value: "+04"},
          {name:"Zulu + 5", value: "+05"},
          {name:"Zulu + 6", value: "+06"},
          {name:"Zulu + 7", value: "+07"},
          {name:"Zulu + 8", value: "+08"},
          {name:"Zulu + 9", value: "+09"},
          {name:"Zulu + 10", value: "+10"},
          {name:"Zulu + 11", value: "+11"},
          {name:"Zulu + 12", value: "+12"},
          {name:"Zulu + 13", value: "+13"},
          {name:"Zulu - 12", value: "-12"},
          {name:"Zulu - 11", value: "-11"},
          {name:"Zulu - 10", value: "-10"},
          {name:"Zulu - 9", value: "-09"},
          {name:"Zulu - 8", value: "-08"},           
          {name:"Zulu - 7", value: "-07"},
          {name:"Zulu - 6", value: "-06"}  
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